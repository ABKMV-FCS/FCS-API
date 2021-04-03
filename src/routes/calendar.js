const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.post('/fetchtimetable', async (req, res) => {
	let { dept, sem, section } = req.body;
	try {
    let result = await query(`select * from active_sem`);
    let {odd,academic_year} = result[0]
    let coursecodes = await query(`select coursecode from faculty_subject where section='${section}' and dept='${dept}'	and sem ='${sem}' and	academic_year='${academic_year}';`);
    let faculties = {}
    for (let index = 0; index < coursecodes.length; index++) {
      let temp = await query(`select faculty from faculty_subject where section='${section}' and dept='${dept}'	and sem ='${sem}' and	academic_year='${academic_year}' and coursecode='${coursecodes[index]["coursecode"]}';`)
      let free = {} 
      for (let index1 = 0; index1 < temp.length; index1++) {
        
        let facultytimetable = await query(`
        select tt.day, tt.slot, tt.coursecode, tt.section, tt.dept, tt.sem from (faculty_subject fs inner join timetable tt on fs.coursecode = tt.coursecode and fs.section = tt.section and fs.sem = tt.sem and fs.academic_year = tt.academic_year) where fs.academic_year = '${academic_year}' and fs.faculty = '${temp[index1]["faculty"]}' and MOD(fs.sem, 2) = '${odd === 'odd' ? 1 : 0}'; `);
        
        let free_slots = [
          "MON-1","MON-2","MON-3","MON-4","MON-5","MON-6","MON-7",
          "TUE-1","TUE-2","TUE-3","TUE-4","TUE-5","TUE-6","TUE-7",
          "WED-1","WED-2","WED-3","WED-4","WED-5","WED-6","WED-7",
          "THU-1","THU-2","THU-3","THU-4","THU-5","THU-6","THU-7",
          "FRI-1","FRI-2","FRI-3","FRI-4","FRI-5","FRI-6","FRI-7",
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
    return res.status(200).json({ message: 'Retrieval Successful!' ,faculties,faculty_sub,timetable });
		
	} catch (error) {
    console.log(error)
		return res.status(500).json({ message: error });
		
	}
});

router.post('/',async(req,res)=>{
  
});
module.exports = router;