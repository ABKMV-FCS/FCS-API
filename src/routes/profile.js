const express = require('express');
const router = express.Router();
const { query } = require('../db');
const moment = require('moment');

router.post('/requestprofilechange', async (req, res) => {
	let { username } = req.tokenDetails;
	let { profilephoto, qualifications, phone, name, email } = req.body;
	try {	
		let result = await query(`REPLACE INTO profilechangerequest VALUES('${username}','${profilephoto}','${qualifications}','${phone}','${name}','${email}')`);
		if(result.affectedRows>0){
			return res.status(200).json({ message: 'Request sent Successfully!' });
		}
		else{
			return res.status(500).json({ message: 'error occurred while requesting profile change!' });
		}
		
	} catch (error) {
		return res.status(500).json({ message: error });
		console.log(error)
	}
});

router.post('/showprofilechangerequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	try {
		let result = await query(`SELECT * FROM profilechangerequest`);
		if (result.length == 0) {
			return res.status(200).json({ message: 'No Requests so far!' });
		} else {
			return res.status(200).json({ requests: result })
		}

	} catch (error) {
		return res.status(500).json({ message: error });
		console.log(error)
	}
});


router.post('/changeuserinfo', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can change userinfo' });
	let { faculty,profilephoto, qualifications, phone, name, email } = req.body;
	let result;
	try {
		await query(`UPDATE USER SET name = '${name}', phone= '${phone}', email='${email}',profilephoto='${profilephoto}',qualifications='${qualifications}' WHERE username='${faculty}';`);
		return res.status(200).json({ message: 'user info updated successfully!' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.get('/readuserinfo/:username', async (req, res) => {
	let { username } = req.params;
	try {
		let result = await query(`select * from user where username='${username}'`);
		if (result.length == 0) { return res.status(400).json({ message: 'username not found' }); return; }
		delete result[0]['password']
		return res.status(200).json({ userinfo: result });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/changesubjectshandledinfo', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can change subjecthandledinfo' });
	let { faculty, coursecodes } = req.body;
	try {
		await query(`DELETE FROM subjects_handled WHERE faculty='${faculty}';`);
		for (let index = 0; index < coursecodes.length; index++) {
			await query(`INSERT INTO subjects_handled VALUES('${faculty}','${coursecodes[index]}');`);
		}
		return res.status(200).json({ message: 'subjects_handled info updated successfully!' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});
router.get('/readsubjectshandledinfo/:username', async (req, res) => {

	let { username } = req.params;
	try {
		let result = await query(`select coursecode from subjects_handled where faculty='${username}'`);
		if (result.length == 0) { return res.status(400).json({ message: 'username not found' }); return; }
		return res.status(200).json({ subjects_handledinfo: result });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/deleteprofile', async (req, res) => {
	let { faculty, datetime } = req.body;
	try {
		datetime = moment(new Date(datetime)).utc(true).format('yyyy-MM-DD')
		let examslots = await query(`select * from exam_slot where faculty='${faculty}' and date>='${datetime}'`);
		let facultysubjects = await query(`select * from faculty_subject where faculty LIKE '${faculty}'`);
		if (facultysubjects.length == 0 && examslots.length == 0) {
			await query(`UPDATE USER SET isactive = 'False' WHERE username='${faculty}';`);
			return res.status(200).json({ message: 'profile deletion successful!' });
		} else {
			return res.status(200).json({ message: 'dependencies found! do change the details before deletion.', dependencies: { facultysubjects, examslots } });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: error });
	}
});

module.exports = router;