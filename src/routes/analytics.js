const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');



router.get('/getcoursefaculties',async (req,res)=>{ //number of faculties handling a coursecode

    try{
        let result = await query(`select distinct coursecode, count(faculty) from subjects_handled group by coursecode;`)
        return res.status(200).json({result, message: "Course Faculty Details Fetched Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error});
    }
})

router.get('/getclasscoursedetails',async (req,res)=>{ //how many hours is each course for every class in a dept in a sem
    try{
        let activesem = await query(`select * from active_sem`);
        let { academic_year } = activesem[0];
        let result = await query(`select distinct coursecode,sem,section,dept, count(coursecode) as totalhours from timetable where academic_year like '${academic_year}' group by coursecode,sem,dept,section;`)
        return res.status(200).json({result, message: "Course Class Details Fetched Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error});
    }
})

router.get('/getfacultyworkinghours',async (req,res)=>{ //how many hours is a faculty going to work
    try{
        let activesem = await query(`select * from active_sem`);
        let { academic_year } = activesem[0];
        let result = await query(`select count(*) as nooffaculties,hours from (select count(*) as hours,faculty from faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section=tt.section and fs.dept = tt.dept and fs.sem = tt.sem and fs.academic_year=tt.academic_year and tt.academic_year like '${academic_year}' GROUP BY faculty) hrs group by hours;`)
        return res.status(200).json({result, message: "Faculty Working Hours Fetched Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error});
    }
})

router.get('/getfacultyfreehours',async (req,res)=>{ //how many hours is a faculty free
    try{
        let activesem = await query(`select * from active_sem`);
        let { academic_year } = activesem[0];
        let result = await query(`select count(*) as nooffaculties,hours from (select (30-count(*)) as hours,faculty from faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section=tt.section and fs.dept = tt.dept and fs.sem = tt.sem and fs.academic_year = tt.academic_year and tt.academic_year like '${academic_year}' GROUP BY faculty) hrs group by hours;`)
        return res.status(200).json({result, message: "Faculty Free Hours Fetched Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error});
    }
})

module.exports = router;
