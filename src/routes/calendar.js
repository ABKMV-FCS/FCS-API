const express = require('express');
const router = express.Router();
const { query } = require('../db');
const verifyJWT = require('../helpers/verify_jwt');
const moment = require('moment');
const config = require('../../config.json');

router.post('/fetchtimetable', async (req, res) => {
  let { dept, sem, section } = req.body;
  try {
    let result = await query(`select * from active_sem`);
    let { odd, academic_year } = result[0];
    let coursecodes = await query(`select coursecode from sem_course where dept='${dept}'	and sem ='${sem}' ;`);
    let faculties = {};
    for (let index = 0; index < coursecodes.length; index++) {
      let temp = await query(`select faculty from subjects_handled where coursecode like '${coursecodes[index].coursecode}'`);
      // console.log(`select faculty from subjects_handled where coursecode like '${coursecodes[index].coursecode}'`)
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
    // console.log(timetable);
    return res.status(200).json({ message: 'Retrieval Successful!', faculties, faculty_sub, slotdata, slots: config.slots });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });

  }
});

async function updateCalendarTable(start_date,end_date,section,dept,sem,academic_year,timetable,emergency_holidays){
  let daymap = {'Monday': 'MON','Tuesday': 'TUE','Wednesday': 'WED','Thursday': 'THU','Friday': 'FRI','Saturday':'SAT','Sunday':'SUN'} 
  start_date =  new Date(start_date)
  end_date=new Date(end_date)
  for (var d = start_date; d< end_date; d.setDate(d.getDate() + 1)) {
    if( !emergency_holidays.includes(d) && daymap[moment(d, "YYYY-MM-DD").format('dddd')] !='SUN' && daymap[moment(d, "YYYY-MM-DD").format('dddd')] != 'SAT' ){
      for(ttobj in timetable){
        console.log(daymap[moment(d, "YYYY-MM-DD").format('dddd')], timetable[ttobj]["day"] , section , timetable[ttobj]["section"] , dept , timetable[ttobj]["dept"] , sem , timetable[ttobj]["sem"] , academic_year ,timetable[ttobj]["academic_year"]);
        if(daymap[moment(d, "YYYY-MM-DD").format('dddd')] == timetable[ttobj]["day"] && section == timetable[ttobj]["section"] && dept == timetable[ttobj]["dept"] && sem == timetable[ttobj]["sem"] && academic_year == timetable[ttobj]["academic_year"]){
          let result = await query(`insert into calendar values('${moment(d).format("YYYY-MM-DD")}','${timetable[ttobj]["slot"]}','${timetable[ttobj]["coursecode"]}','${timetable[ttobj]["section"]}','${timetable[ttobj]["dept"]}','${timetable[ttobj]["sem"]}','${timetable[ttobj]["academic_year"]}');`)
        }
      } 
    }
  }
  
}

router.post('/updatetimetable', async (req, res) => {
  try {
    let { slotdata, coursetofacultydata, dept, sem, section } = req.body;
    let course_faculty = {}
    let result = await query(`select * from active_sem`);
    let { academic_year,start_date,end_date } = result[0];
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
          // console.log(`faculty: ${ent.faculty} cannot handle coursecode: ${ent.coursecode}`);
          return res.status(400).json({ message: `faculty: ${ent.faculty} cannot handle coursecode: ${ent.coursecode}` });
        }
      }
    }
    for (let period of timetable) {
      if (course_faculty[period.coursecode] === undefined) {
        console.log(`faculty for ${period.coursecode} is not found`);
        return res.status(400).json({ message: `faculty for ${period.coursecode} is not found` });
      }
    }
    for (const fs of faculty_subject) {
      if(fs.faculty === '-') {
        // console.log(fs);
        await query(`delete from faculty_subject where coursecode like '${fs.coursecode}' and section like '${fs.section}' and dept like '${fs.dept}' and sem=${fs.sem} and academic_year=${fs.academic_year};`);
      }
      else await query(`replace into faculty_subject values('${fs.faculty}', '${fs.coursecode}' ,'${fs.section}','${fs.dept}','${fs.sem}','${fs.academic_year}')`)
    }
    await query(`delete from timetable where section like '${section}' and dept like '${dept}' and sem=${sem} and academic_year=${academic_year};`);
    for (const tt of timetable) {
      await query(`replace into timetable values('${tt.slot}','${tt.day}','${tt.coursecode}','${tt.section}','${tt.dept}','${tt.sem}','${tt.academic_year}')`);
    }
    await query(`delete from calendar where section like '${section}' and dept like '${dept}' and sem=${sem} and academic_year=${academic_year} and (slot='1' or slot='2' or slot='3' or slot='4' or slot='5' or slot='6') and date>='${start_date}' and date<='${end_date}';`);
    timetable = await query(`select * from timetable where section like '${section}' and dept like '${dept}' and sem=${sem} and academic_year=${academic_year};`)
    let emergency_holidays = await query(`select date from holiday;`);
    let temp = []
    for(tempObj of emergency_holidays){
      temp.push(tempObj["date"])
    }
    
    await updateCalendarTable(start_date,end_date,section,dept,sem,academic_year,timetable,temp)
    
    
    return res.status(200).json({ message: "update successful, time table successfully changed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  
});

async function getCalendarEvents({ forDate }, username) {
	if (!(forDate)) throw new Error();
	// starttime in vuetify calendar format
	let events = [];
  start_date =  new Date(forDate)
  let result = await query(`select * from calendar c JOIN faculty_subject fs ON c.coursecode = fs.coursecode and c.section = fs.section and c.dept = fs.dept and c.sem = fs.sem and c.academic_year = fs.academic_year where fs.faculty like '${username}' and date >= '${forDate}' and date <= '${moment(start_date, "YYYY-MM-DD").add(7, 'days').format('YYYY-MM-DD')}' and slot not like 'et%';`);
  let examresult = await query(`select * from calendar c JOIN exam_slot es ON c.coursecode = es.coursecode and c.dept = es.dept and c.sem = es.sem and c.section = es.section and c.academic_year = es.academic_year where es.faculty like '${username}' and c.date >= '${forDate}' and c.date <= '${moment(start_date, "YYYY-MM-DD").add(7, 'days').format('YYYY-MM-DD')}' and slot like 'et%';`);
  let holidays = await query(`select * from holiday where date >= '${forDate}' and date <= '${moment(start_date, "YYYY-MM-DD").add(7, 'days').format('YYYY-MM-DD')}';`);
  let slots = config.slots;
  let exam_slots = config.exam_slots;
	for (let event of result) {
    let time = slots['slot'+event.slot].split('-');
    events.push({
      name: `${event.coursecode} Lecture`,
      details: `Details:\nCourse: ${event.coursecode}\nDept: ${event.dept}\nSection: ${event.section}\nSem: ${event.sem}`,
      start: `${event.date} ${time[0]}`,
      end: `${event.date} ${time[1]}`,
      color: 'blue',
      timed: true
    });      
	}
  for (let event of examresult) {
    let time = [exam_slots[event.slot].st,exam_slots[event.slot].et];
    events.push({
      name: `Exam Invigilation Duty`,
      details: `Details:\nExam: ${event.coursecode}\nDept: ${event.dept}\nSection: ${event.section}\nSem: ${event.sem}`,
      start: `${event.date} ${time[0]}`,
      end: `${event.date} ${time[1]}`,
      color: 'orange',
      timed: true
    });
  }
  for (let event of holidays) {
    events.push({
      name: `Holiday`,
      details: `Reason: ${event.reason}`,
      start: `${event.date}`,
      end: `${event.date}`,
      color: 'red',
      timed: false
    });
  }
	return events;
}

router.post('/getcalendarevents', async (req, res) => {
  if (req.tokenDetails.role !== 'faculty')
		return res.status(400).json({ message: 'only faculties can view calendar data' });
    try{
  let username = req.tokenDetails.username;
	let resp = await getCalendarEvents(req.body, username);
	return res.status(200).json({data: resp, message: " Exam Schedule Fetched Successfully"});
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

router.get('/test', async (req, res) => {
})
module.exports = router;