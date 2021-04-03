const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.post('/studenttimetabledownload', async (req, res) => {
  let { dept, section, sem, academic_year } = req.body;
  try {
    let result = await query(`SELECT slot, day, coursecode from Timetable WHEREsection = '${section}' and sem = '${sem}' and dept = '${dept}' and academic_year = '${academic_year}' `);
    if (result.length == 0) { return res.status(200).json({ message: 'no data available' }); }
    let coursename;
    for (let index = 0; index < result.length; index++) {
      coursename = await query(`SELECT name from course WHERE code = '${result[index].coursecode}'`);
      result[index]["coursename"] = coursename[0].name;
    }
    return res.status(200).json({ timetable: result, message: 'retrieval successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post('/facultytimetabledownload', async (req, res) => {
  let { academic_year, faculty, odd } = req.body;
  try {
    let result = await query(`
    select tt.day, tt.slot, tt.coursecode, tt.section, tt.dept, tt.sem from (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year) where fs.academic_year = '${academic_year}' and fs.faculty = '${faculty}' and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}'; `);
    let coursename;
    for (let index = 0; index < result.length; index++) {
      coursename = await query(`SELECT name from course WHERE code = '${result[index].coursecode}'`);
      result[index]["coursename"] = coursename[0].name;
    }
    return res.status(200).json({ timetable: result, message: 'retrieval successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post('/examtimetabledownload', async (req, res) => {
  let { dept, type, sem, academic_year } = req.body;
  try {
    let result = await query(`SELECT date, exam_slot, faculty, coursecode from exam_slot WHERE type = '${type}' and sem = '${sem}' and dept = '${dept}' and academic_year = '${academic_year}' `);
    let coursename;
    for (let index = 0; index < result.length; index++) {
      coursename = await query(`SELECT name from course WHERE code = '${result[index].coursecode}'`);
      result[index]["coursename"] = coursename[0].name;
    }
    return res.status(200).json({ timetable: result, message: 'retrieval successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});


router.get('/readdept', async (req, res) => {
  try {
    let result = await query(`select dept from dep_duration;`);
    if (result.length == 0) { return res.status(400).json({ message: 'depts not found' }); return; }
    for (let index = 0; index < result.length; index++) {
      result[index] = result[index].dept;
    }
    return res.status(200).json({ deptinfo: result, message: 'retrieval successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/createdept', async (req, res) => {
  let { dept, sems } = req.body;
  try {
    await query(`insert into dep_duration values ('${dept}','${sems}');`);
    return res.status(200).json({ message: 'insertion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/updatedept', async (req, res) => {
  let { sems, dept } = req.body;
  try {
    await query(`update dep_duration set sems='${sems}' where dept like '${dept}';`);
    return res.status(200).json({ message: 'update successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/deletedept', async (req, res) => {
  let { dept } = req.body;
  try {
    let result = await query(`select * from dep_duration where dept like '${dept}';`);
    if (result.length == 0) { return res.status(400).json({ message: 'dept not found' }); return; }
    await query(`delete from dep_duration where dept like '${dept}';`);
    return res.status(200).json({ message: 'deletion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});



router.get('/readclassesunderdept/:dept', async (req, res) => {
  let { dept } = req.params
  try {
    let result = await query(`select section from dept_class where dept like '${dept}';`);
    if (result.length == 0) { return res.status(400).json({ message: 'depts not found' }); return; }
    for (let index = 0; index < result.length; index++) {
      result[index] = result[index].section;
    }
    return res.status(200).json({ deptinfo: result, message: 'retrieval successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/createclassesunderdept', async (req, res) => {
  let { dept, section } = req.body;
  try {
    await query(`insert into dept_class values ('${dept}','${section}');`);
    return res.status(200).json({ message: 'insertion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post('/deleteclassesunderdept', async (req, res) => {
  let { dept, section } = req.body;
  try {
    let result = await query(`select * from dept_class where dept like '${dept}' and section like '${section}';`);
    if (result.length == 0) { return res.status(400).json({ message: 'section not found' }); return; }
    await query(`delete from dept_class where dept like '${dept}' and section like '${section}';`);
    return res.status(200).json({ message: 'deletion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post('/createcourse', async (req, res) => {
  let { coursecode, name } = req.body;
  try {
    await query(`insert into course values ('${coursecode}','${name}');`);
    return res.status(200).json({ message: 'insertion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/updatecourse', async (req, res) => {
  let { name, coursecode } = req.body;
  try {
    await query(`update course set name='${name}' where code like '${coursecode}';`);
    return res.status(200).json({ message: 'update successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/deletecourse', async (req, res) => {
  let { coursecode } = req.body;
  try {
    let result = await query(`select * from course where code like '${coursecode}';`);
    if (result.length == 0) { return res.status(400).json({ message: 'course not found' }); return; }
    await query(`delete from sem_course where coursecode like '${coursecode}';`);
    await query(`delete from course where code like '${coursecode}';`);
    return res.status(200).json({ message: 'deletion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});


router.post('/createcourseundersem', async (req, res) => {
  let { coursecode, dept, sem } = req.body;
  try {
    await query(`insert into sem_course values('${dept}','${sem}','${coursecode}');`);
    return res.status(200).json({ message: 'insertion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post('/deletecourseundersem', async (req, res) => {
  let { coursecode, dept, sem } = req.body;
  try {
    let result = await query(`select * from sem_course where dept like '${dept}' and sem like '${sem}' and coursecode like '${coursecode}';`);
    if (result.length == 0) { return res.status(400).json({ message: 'course not found' }); }
    await query(`delete from sem_course where dept like '${dept}' and sem like '${sem}' and coursecode like '${coursecode}';`);
    return res.status(200).json({ message: 'deletion successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;