const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.post('/fetchtimetable', async (req, res) => {
  let { dept, sem, section } = req.body;
  try {
    let result = await query(`select * from active_sem`);
    let { odd, academic_year } = result[0];
    let coursecodes = await query(`select coursecode from sem_course where dept='${dept}'	and sem ='${sem}' ;`);
    let faculties = {};
    for (let index = 0; index < coursecodes.length; index++) {
      // let temp = await query(`select faculty from faculty_subject where section='${section}' and dept='${dept}'	and sem ='${sem}' and	academic_year='${academic_year}' and coursecode='${coursecodes[index]["coursecode"]}';`)
      let temp = await query(`select faculty from subjects_handled where coursecode like '${coursecodes[index].coursecode}'`);
      console.log(`select faculty from subjects_handled where coursecode like '${coursecodes[index].coursecode}'`)
      let free = {}
      for (let index1 = 0; index1 < temp.length; index1++) {

        let facultytimetable = await query(`
        select tt.day, tt.slot, tt.coursecode, tt.section, tt.dept, tt.sem from (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year) where fs.academic_year = '${academic_year}' and fs.faculty = '${temp[index1]["faculty"]}' and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}'; `);

        let free_slots = [
          "MON-1", "MON-2", "MON-3", "MON-4", "MON-5", "MON-6",
          "TUE-1", "TUE-2", "TUE-3", "TUE-4", "TUE-5", "TUE-6",
          "WED-1", "WED-2", "WED-3", "WED-4", "WED-5", "WED-6",
          "THU-1", "THU-2", "THU-3", "THU-4", "THU-5", "THU-6",
          "FRI-1", "FRI-2", "FRI-3", "FRI-4", "FRI-5", "FRI-6",
        ]

        for (let index4 = 0; index4 < facultytimetable.length; index4++) {
          const index = free_slots.indexOf(facultytimetable[index4]["day"].concat("-".concat(facultytimetable[index4]["slot"])));
          free_slots.splice(index, 1);
        }
        free[temp[index1]["faculty"]] = free_slots;
      }
      faculties[coursecodes[index]["coursecode"]] = free;
    }
    let faculty_sub = await query(`select faculty, coursecode from faculty_subject where dept = '${dept}' and sem='${sem}' and section='${section}' and academic_year = '${academic_year}'`);
    let timetable = await query(`select * from timetable where dept = '${dept}' and sem='${sem}' and section='${section}' and academic_year = '${academic_year}'`);

    let slotdata = [
      { slot1: "-", slot2: "-", slot3: "-", slot4: "-", slot5: "-", slot6: "-" },
      { slot1: "-", slot2: "-", slot3: "-", slot4: "-", slot5: "-", slot6: "-" },
      { slot1: "-", slot2: "-", slot3: "-", slot4: "-", slot5: "-", slot6: "-" },
      { slot1: "-", slot2: "-", slot3: "-", slot4: "-", slot5: "-", slot6: "-" },
      { slot1: "-", slot2: "-", slot3: "-", slot4: "-", slot5: "-", slot6: "-" },
    ];

    let daymap = {"MON":0,"TUE":1,"WED":2,"THU":3,"FRI":4};

    for(let tt of timetable) {
      slotdata[daymap[tt.day]][`slot${tt.slot}`] = tt.coursecode;
    }
    console.log(timetable);
    return res.status(200).json({ message: 'Retrieval Successful!', faculties, faculty_sub, slotdata });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });

  }
});

router.post('/updatetimetable', async (req, res) => {
  try {
    let { slotdata, coursetofacultydata, dept, sem, section } = req.body;
    let course_faculty = {}
    let result = await query(`select * from active_sem`);
    let { odd, academic_year } = result[0];
    let daymap = {'monday': 'MON','tuesday': 'TUE','wednesday': 'WED','thursday': 'THU','friday': 'FRI'}
    let timetable = [];
    for (let sd of slotdata) {
      for (let [key,value] of Object.entries(sd)) {
        if(key === "day") continue;
        if(value !== '-') {
          let data = {
            slot: parseInt(key.charAt(4)),
            day: daymap[sd.day],
            coursecode: value,
            section,
            dept,
            sem,
            academic_year
          };
          timetable.push(data);
        }
      }
    }
    let faculty_subject = [];
    for (let fd in coursetofacultydata) {
      if(coursetofacultydata[fd].coursecode === '-') continue;
      else {
        faculty_subject.push({
          faculty: coursetofacultydata[fd].faculty,
          coursecode: coursetofacultydata[fd].coursecode,
          section,
          dept,
          sem,
          academic_year
        });
      }
    }
    for (const ent of faculty_subject) {
      if(ent.faculty !== '-') {
        course_faculty[ent.coursecode] = ent.faculty;
        let result = await query(`select count(*) as entry from subjects_handled where faculty like '${ent.faculty}' and coursecode like '${ent.coursecode}'`);
        if (result.length === 0 || result[0].entry === 0) {
          return res.status(400).json({ message: `faculty: ${ent.faculty} cannot handle coursecode: ${ent.coursecode}` });
        }
      }
    }
    for (let period of timetable) {
      if (course_faculty[period.coursecode] === undefined) {
        return res.status(400).json({ message: `faculty for ${period.coursecode} is not found` });
      }

    //   let result = await query(`
    // select tt.coursecode, tt.section, tt.dept, tt.sem from 
    // (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode
    //  and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year)
    //  where fs.academic_year = '${academic_year}' and fs.faculty = '${course_faculty[period.coursecode]}' 
    //  and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}' and tt.day = '${period.day}' and tt.slot='${period.slot}' ;`);

    //   if (result.length > 0 && (result[0].coursecode != period.coursecode || result[0].section != period.section || result[0].dept != period.dept || result[0].sem != period.sem)) {
    //     return res.status(400).json({ message: `faculty has already been assigned-slot: ${result[0].slot},day: ${result[0].day}, coursecode:${result[0].coursecode}, section:${result[0].section}, dept:${result[0].dept}, sem:${result[0].sem}` })
    //   }
    }
    for (const fs of faculty_subject) {
      if(fs.faculty === '-') {
        console.log(fs);
        await query(`delete from faculty_subject where coursecode like '${fs.coursecode}' and section like '${fs.section}' and dept like '${fs.dept}' and sem=${fs.sem} and academic_year=${fs.academic_year};`); 
      }
      else await query(`replace into faculty_subject values('${fs.faculty}', '${fs.coursecode}' ,'${fs.section}','${fs.dept}','${fs.sem}','${fs.academic_year}')`)
    }
    await query(`delete from timetable where section like '${section}' and dept like '${dept}' and sem=${sem} and academic_year=${academic_year};`); 
    for (const tt of timetable) {
      await query(`replace into timetable values('${tt.slot}','${tt.day}','${tt.coursecode}','${tt.section}','${tt.dept}','${tt.sem}','${tt.academic_year}')`);
    }
    return res.status(200).json({ message: "update successful, time table successfully changed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }

});
module.exports = router;