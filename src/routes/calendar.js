const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.post('/fetchtimetable', async (req, res) => {
  let { dept, sem, section } = req.body;
  try {
    let result = await query(`select * from active_sem`);
    let { odd, academic_year } = result[0]
    let coursecodes = await query(`select coursecode from sem_course where dept='${dept}'	and sem ='${sem}' ;`);
    let faculties = {}
    for (let index = 0; index < coursecodes.length; index++) {
      let temp = await query(`select faculty from faculty_subject where section='${section}' and dept='${dept}'	and sem ='${sem}' and	academic_year='${academic_year}' and coursecode='${coursecodes[index]["coursecode"]}';`)
      let free = {}
      for (let index1 = 0; index1 < temp.length; index1++) {

        let facultytimetable = await query(`
        select tt.day, tt.slot, tt.coursecode, tt.section, tt.dept, tt.sem from (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year) where fs.academic_year = '${academic_year}' and fs.faculty = '${temp[index1]["faculty"]}' and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}'; `);

        let free_slots = [
          "MON-1", "MON-2", "MON-3", "MON-4", "MON-5", "MON-6", "MON-7",
          "TUE-1", "TUE-2", "TUE-3", "TUE-4", "TUE-5", "TUE-6", "TUE-7",
          "WED-1", "WED-2", "WED-3", "WED-4", "WED-5", "WED-6", "WED-7",
          "THU-1", "THU-2", "THU-3", "THU-4", "THU-5", "THU-6", "THU-7",
          "FRI-1", "FRI-2", "FRI-3", "FRI-4", "FRI-5", "FRI-6", "FRI-7",
        ]

        for (let index4 = 0; index4 < facultytimetable.length; index4++) {
          const index = free_slots.indexOf(facultytimetable[index4]["day"].concat("-".concat(facultytimetable[index4]["slot"])));
          free_slots.splice(index, 1);
        }
        free[temp[index1]["faculty"]] = free_slots;
        console.log(facultytimetable);
      }
      faculties[coursecodes[index]["coursecode"]] = free
    }
    console.log(faculties)
    let faculty_sub = await query(`select * from faculty_subject where dept = '${dept}' and sem='${sem}' and section='${section}' and academic_year = '${academic_year}'`);
    let timetable = await query(`select * from timetable where dept = '${dept}' and sem='${sem}' and section='${section}' and academic_year = '${academic_year}'`);
    return res.status(200).json({ message: 'Retrieval Successful!', faculties, faculty_sub, timetable });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });

  }
});

router.post('/updatetimetable', async (req, res) => {
  try {
    let { timetable, faculty_subject } = req.body;
    let course_faculty = {}
    let result = await query(`select * from active_sem`);
    let { odd, academic_year } = result[0]
    console.log(faculty_subject)
    for (const ent of faculty_subject) {
      course_faculty[ent.coursecode] = ent.faculty
    }
    for (let period of timetable) {
      if (course_faculty[period.coursecode] === undefined) {
        return res.status(400).json({ message: `faculty for ${period.coursecode} is not found` })
      }

      let result = await query(`
    select tt.coursecode, tt.section, tt.dept, tt.sem from 
    (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode
     and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year)
     where fs.academic_year = '${academic_year}' and fs.faculty = '${course_faculty[period.coursecode]}' 
     and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}' and tt.day = '${period.day}' and tt.slot='${period.slot}' ;`);

      if (result.length > 0 && (result[0].coursecode != period.coursecode || result[0].section != period.section || result[0].dept != period.dept || result[0].sem != period.sem)) {
        return res.status(400).json({ message: `faculty has already been assigned-slot: ${result[0].slot},day: ${result[0].day}, coursecode:${result[0].coursecode}, section:${result[0].section}, dept:${result[0].dept}, sem:${result[0].sem}` })
      }
    }
    for (const fs of faculty_subject) {
      
      await query(`replace into faculty_subject values('${fs.faculty}', '${fs.coursecode}' ,'${fs.section}','${fs.dept}','${fs.sem}','${fs.academic_year}')`)
    }
    for (const tt of timetable) {
      await query(`replace into timetable values('${tt.slot}','${tt.day}','${tt.coursecode}','${tt.section}','${tt.dept}','${tt.sem}','${tt.academic_year}')`)
    }
    return res.status(200).json({ message: "update successful, time table successfully changed" });
  } catch(error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }

});
module.exports = router;