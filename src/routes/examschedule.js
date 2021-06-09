const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');
const moment = require('moment');
const verifyJWT = require('../helpers/verify_jwt');

router.post('/examscheduleinit', verifyJWT, async (req, res) => {
  let { dept, es, sem, startDate, endDate } = req.body;
  try {
    let result = await query(`select * from active_sem`);
    let { academic_year } = result[0];
    await query(`delete from calendar where dept = '${dept}' and sem = ${parseInt(sem)} and academic_year = ${parseInt(academic_year)} and date>='${startDate}' and date<='${endDate}';`)
    console.log(es);
    for(let row of es){
      await query(`delete from exam_slot where date like '${row[0]}' and sem like '${row[3]}' and dept like '${row[4]}' and section like '${row[7]}' and academic_year like '${academic_year}';`)
      await query(`insert into exam_slot values('${row[0]}','${row[1]}','${row[2]}','${row[3]}','${row[7]}','${row[4]}','${row[5]}','${row[6]}','${academic_year}');`)
      let day = moment(row[0], "YYYY-MM-DD").format('dddd');
      await query(`delete from calendar c where (c.coursecode, c.slot,c.dept,c.section,c.sem) IN (select coursecode,  slot,dept,section,sem from timetable t where t.day= '${day}' and (t.slot >= '${config["exam_slots"][row[1]]["periods"][0]}' and t.slot <= '${config["exam_slots"][row[1]]["periods"][config["exam_slots"][row[1]]["periods"].length-1]}')) and (dept, coursecode,section,sem) IN (select dept, coursecode,section,sem from faculty_subject fs where fs.sem <> '${row[3]}' and fs.faculty like '${row[5]}');`)
      await query(`insert into calendar values('${row[0]}','${row[1]}','${row[2]}','${row[7]}','${row[4]}','${row[3]}','${academic_year}');`)
    }
    return res.status(200).json({ message: 'Update Successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.post('/getexamschedule', async(req,res)=>{
  let {type, dept, sem, startdate, enddate} = req.body;
  
  try{
    let activesem = await query(`select * from active_sem`);
    let { academic_year } = activesem[0];
    let examslot = config.exam_slots;

    let sections = await query(`select section from dept_class where dept like '${dept}';`);
    sections = sections.map(element => element.section);

    let courses  = await query(`select coursecode from sem_course where dept like '${dept}' and sem like '${sem}';`);
    courses = courses.map(element => element.coursecode);

    let faculties = await query(`select name as faculty from user where isactive='true' and role='faculty'`);
    faculties = faculties.map(element => element.faculty);

    let result = await query(`select * from exam_slot where sem = '${sem}' and date>='${startdate}' and date <= '${enddate}' and dept like '${dept}' and type like '${type}';`)
    return res.status(200).json({result, sections, faculties, courses, totalslot: Object.keys(examslot), academic_year,  message: " Exam Schedule Fetched Successfully"})
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

router.post('/downloadexamschedule', async(req,res)=>{
  let {sem, type} = req.body;
  
  try{
    let activesem = await query(`select * from active_sem`);
    let { academic_year } = activesem[0];
    let examslot = {...config.exam_slots};
    for (let slot in examslot) {
      examslot[slot] = `${examslot[slot].st}-${examslot[slot].et}`
    }
    let timetable = await query(`select * from exam_slot where sem = '${sem}' and type like '${type}' and academic_year = '${academic_year}';`)
    return res.status(200).json({timetable, examtypes: examslot, message: " Exam Schedule Fetched Successfully"})
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});



module.exports = router;