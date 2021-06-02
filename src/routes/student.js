const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');

router.get('/subscribeinit', async (req, res) => {
	try {
		let activesem = await query('select * from active_sem');
		let { academic_year, odd } = activesem[0];
		let result = await query(`select * from dept_class`);
		let departmentClasses = {};
		for (let row of result) {
			if (!departmentClasses[row.dept]) departmentClasses[row.dept] = [];
			departmentClasses[row.dept].push(row.section);
		}

		return res.status(200).json({ academic_year, odd, departmentClasses });
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});

router.post('/subscribe', async (req, res) => {
	try {
		let {
			name,
			email,
			sem,
			dept,
			section,
			academic_year,
			fcmToken
		} = req.body;
		await query(`insert into student_subscribe values('${email}','${name}','${dept}','${section}',${sem},${academic_year},'${fcmToken}') ON DUPLICATE KEY UPDATE name='${name}', dept='${dept}', section='${section}', sem='${sem}', academic_year='${academic_year}', fcmToken='${fcmToken}'`)
		return res.status(200).json({ message:'subscribed successfully!'});
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});





module.exports = router;