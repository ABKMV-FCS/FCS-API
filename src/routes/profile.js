const express = require('express');
const router = express.Router();
const { query } = require('../db');
const moment = require('moment');
const { verify } = require('jsonwebtoken');

router.post('/requestprofilechange', async (req, res) => {
	let { username } = req.tokenDetails;
	let { profilephoto, qualifications, phone, name, email } = req.body;
	try {
		let result = await query(`REPLACE INTO profilechangerequest VALUES('${username}','${profilephoto}','${qualifications}','${phone}','${name}','${email}')`);
		if (result.affectedRows > 0) {
			return res.status(200).json({ message: 'Request sent Successfully!' });
		}
		else {
			return res.status(500).json({ message: 'error occurred while requesting profile change!' });
		}

	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.get('/showprofilechangerequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	try {
		let result = await query(`SELECT * FROM profilechangerequest`);
		if (result.length == 0) {
			return res.status(200).json({ message: 'No Requests so far!' });
		} else {
			return res.status(200).json({ requests: result });
		}

	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/acceptprofilechangerequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can accept request' });
	let { faculty } = req.body;
	try {
		let result = (await query(`select * FROM profilechangerequest where faculty like '${faculty}'`));
		if (result.length == 0) return res.status(400).json({ message: 'No Requests Found!' });
		let { name, phone, qualifications, profilephoto, email } = result[0];
		await query(`UPDATE USER SET username = '${faculty}', name = '${name}', phone= '${phone}', email='${email}',profilephoto='${profilephoto}',qualifications='${qualifications}' WHERE username='${faculty}';`);
		await query(`delete from profilechangerequest where faculty like '${faculty}'`);
		res.status(200).json({ message: 'user info updated successfully!' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});

router.post('/rejectprofilechangerequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can reject request' });
	let { faculty } = req.body;
	try {
		await query(`delete from profilechangerequest where faculty like '${faculty}'`);
		return res.status(200).json({ message: 'removed request' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});


router.post('/changeuserinfo', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		res.status(400).json({ message: 'only admin can change userinfo' });
	let { oldusername, username, profilephoto, qualifications, phone, name, email } = req.body;
	try {
		await query(`UPDATE USER SET username = '${username}', name = '${name}', phone= '${phone}', email='${email}',profilephoto='${profilephoto}',qualifications='${qualifications}' WHERE username='${oldusername}';`);
		res.status(200).json({ message: 'user info updated successfully!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(400).json({ message: 'username already taken' });
		}
		res.status(500).json({ message: error });
	}
});

router.get('/getallusers', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can get all user info' });
	try {
		let results = await query(`select * from user where isactive='true'`);
		if (results.length == 0) { return res.status(400).json({ message: 'no users found' }); }
		let result;
		for (result of results) delete result['password'];
		return res.status(200).json({ users: results });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.get('/getallfaculties', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can get all faculty info' });
	try {
		let results = await query(`select username as faculty, name from user where isactive='true' and role='faculty'`);
		if (results.length == 0) { return res.status(400).json({ message: 'no faculties found' }); }
		return res.status(200).json({ faculties: results });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.get('/readuserinfo/:username', async (req, res) => {
	let { username } = req.params;
	try {
		let result = await query(`select * from user where username='${username}'`);
		if (result.length == 0) { return res.status(400).json({ message: 'username not found' }); }
		delete result[0]['password'];
		return res.status(200).json({ userinfo: result });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.get('/initprofilechangedetails', async (req, res) => {
	let { username } = req.tokenDetails;
	try {
		let result = await query(`select * from profilechangerequest where faculty='${username}'`);
		if (result.length == 0) {
			result = await query(`select * from user where username='${username}'`);
			delete result[0]['password'];
			return res.status(200).json({ result:result[0] });
		}
		return res.status(200).json({ result:result[0] });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/changesubjectshandledinfo', async (req, res) => {
	if (req.tokenDetails.role !== 'admin'){
		return res.status(400).json({ message: 'only admin can change subjecthandledinfo' });

	}
	let { faculty, coursecodes } = req.body;
	try {
		await query(`DELETE FROM subjects_handled WHERE faculty='${faculty}';`);
		if(coursecodes.length !=0){
			for (const coursecode of coursecodes) {
				await query(`INSERT INTO subjects_handled VALUES('${faculty}','${coursecode}');`);
			}
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
		console.log(username);
		let result = await query(`select coursecode from subjects_handled where faculty='${username}'`);
		return res.status(200).json({ subjects_handledinfo: result });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});



module.exports = router;