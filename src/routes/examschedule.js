const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');
const moment = require('moment');

router.post('/examscheduleinit', async (req, res) => {
  let { es, sem, startdate, enddate } = req.body;
  try {
    let result = await query(`select * from active_sem`);
    let { academic_year } = result[0];
    await query(`delete from calendar where sem like '${sem}' and academic_year like '${academic_year}' and date>='${startdate}' and date<='${enddate}';`)
    for(row of es){
      await query(`insert into exam_slot values('${row[0]}','${row[1]}','${row[2]}','${row[3]}','${row[4]}','${row[5]}','${row[6]}','${academic_year}');`)
      row[1] = "et"+ row[1]
      let day = moment(row[0], "YYYY-MM-DD").format('dddd');
      await query(`delete from calendar c where (c.coursecode, c.slot,c.dept,c.section,c.sem) IN (select coursecode,  slot,dept,section,sem from timetable t where t.day= '${day}' and (t.slot >= '${config["exam_slots"][row[1]]["periods"][0]}' and t.slot <= '${config["exam_slots"][row[1]]["periods"][config["exam_slots"][row[1]]["periods"].length-1]}')) and (dept, coursecode,section,sem) IN (select dept, coursecode,section,sem from faculty_subject fs where fs.sem <> '${row[3]}' and fs.faculty like '${row[5]}');`)
      let sections = await query(`select * from dept_class where dept like '${row[4]}'`)
      for(section of sections){
        await query(`insert into calendar values('${row[0]}','${row[1]}','${row[2]}','${section['section']}','${row[4]}','${row[3]}','${academic_year}');`)
      }
    }
    return res.status(200).json({ message: 'Update Successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.get('/getexamschedule', async(req,res)=>{
  let {sem, startdate, enddate} = req.body;
  
  try{
    let activesem = await query(`select * from active_sem`);
    let examslot = config.examSlotTimings;
    let result = await query(`select * from exam_slot where sem = '${sem}' and date>='${startdate}' and date<='${enddate}';`)
    return res.status(200).json({result,totalslot: Object.keys(examslot),activesem: activesem[0], message: " Exam Schedule Fetched Successfully"})
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

router.get('/downloadexamschedule', async(req,res)=>{
  let {sem, dept, type} = req.body;
  
  try{
    let activesem = await query(`select * from active_sem`);
    let { academic_year } = activesem[0];
    let result = await query(`select * from exam_slot where sem = '${sem}' and dept like '${dept}' and type like '${type}' and academic_year = '${academic_year}';`)
    return res.status(200).json({result, message: " Exam Schedule Fetched Successfully"})
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});


module.exports = router;