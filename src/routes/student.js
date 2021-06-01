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
		
		return res.status(200).json({ academic_year, odd, departmentClasses});
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});



module.exports = router;