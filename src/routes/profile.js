const express = require('express');
const router = express.Router();
const { query } = require('../db');
const verifyJWT = require('../helpers/verify_jwt');

router.post('/requestprofilechange', async (req, res) => {
	let { faculty_username, profilephoto, qualifications, phone, name, isactive, email, coursecodes } = req.body;
	try {
		let result = await query(`SELECT * FROM profilechangerequests WHERE faculty_username LIKE '${faculty_username}'`);
		if (result.length == 0) {
			await query(`INSERT INTO profilechangerequests values("${faculty_username}","${profilephoto}","${qualifications}","${phone}","${name}","${isactive}","${email}","${coursecodes}");`);
			res.status(200).json({ message: 'Request sent Successfully!' });
		} else {
			console.log(req.body.faculty_username)
			await query(`UPDATE profilechangerequests SET profilephoto = "${profilephoto}", qualifications = "${qualifications}", phone = "${phone}", name = "${name}", isactive = "${isactive}", email = "${email}",coursecodes="${coursecodes}" WHERE faculty_username="${faculty_username}";`);
			res.status(200).json({ message: 'Details Updated Successfully!' });;
		}

	} catch (error) {
		res.status(500).json({ message: error });
		console.log(error)
	}
});

router.post('/showprofilechangerequests', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	try {
		let result = await query(`SELECT * FROM profilechangerequests`);
		if (result.length == 0) {
			return res.status(200).json({ message: 'No Requests so far!' });
		} else {
			res.status(200).json({ requests: result })
		}

	} catch (error) {
		res.status(500).json({ message: error });
		console.log(error)
	}
});


router.post('/changeuserinfo', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can change userinfo' });
	let { faculty_username } = req.body;

	try {
		let result = await query(`select * from profilechangerequests where faculty_username="${faculty_username}"`);
		await query(`UPDATE USER SET name = "${result[0].name}", phone= "${result[0].phone}", email="${result[0].email}" WHERE username="${faculty_username}";`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		res.status(200).json({ message: 'user info updated successfully!' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.get('/readuserinfo/:username', async (req, res) => {

	let { username } = req.params;
	try {
		let result = await query(`select name,phone,email from user where username="${username}"`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		res.status(200).json({ userinfo: result });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});


router.post('/changeprofileinfo', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can change profileinfo' });
	let { faculty_username } = req.body;

	try {
		let result = await query(`select * from profilechangerequests where faculty_username="${faculty_username}"`);
		await query(`UPDATE profile SET profilephoto="${result[0].profilephoto}",qualifications = "${result[0].qualifications}" WHERE faculty_username="${faculty_username}";`);
		if (result[0].length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		res.status(200).json({ message: 'profile info updated successfully!' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});
router.get('/readprofileinfo/:username', async (req, res) => {

	let { username } = req.params;
	try {
		let result = await query(`select profilephoto,qualifications from profile where faculty_username="${username}"`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		res.status(200).json({ profileinfo: result });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/changesubjectshandledinfo', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can change subjecthandledinfo' });
	let { faculty_username } = req.body;
	try {
		let result = await query(`select * from profilechangerequests where faculty_username="${faculty_username}"`);
		await query(`UPDATE subjectshandled SET coursecodes="${result[0].coursecodes}" WHERE faculty_username="${faculty_username}";`);
		console.log(result)
		if (result.length == 0) { res.status(400).json({ message: 'username/coursecode not found' }); return; }
		res.status(200).json({ message: 'subjectshandled info updated successfully!' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});
router.get('/readsubjectshandledinfo/:username', async (req, res) => {

	let { username } = req.params;
	try {
		let result = await query(`select coursecodes from subjectshandled where faculty_username="${username}"`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		res.status(200).json({ subjectshandledinfo: result });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.get('/deleteprofilerequest/:faculty_username', verifyJWT, async (req, res) => {
	let { faculty_username } = req.params;
	try {
		let result = await query(`select * from profile where faculty_username = "${faculty_username}"`);
		let coursecodes = await query(`select coursecodes from subjectshandled where faculty_username="${faculty_username};"`);
		let facultych = await query(`select day,slot,dept,class,sem,academic_year from facultych where faculty="${faculty_username}"`);
		let examslots = await query(`select startdatetime, enddatetime,	subject, sem, type, academicyear, dep from examslots where faculty="${faculty_username}"`);
		if (result.length !=0 && coursecodes.length == 0 && facultych.length == 0 && examslots.length == 0 ) { 
			res.status(200).json({ message: 'no dependencies found! Do you wish to delete??' });
			return; 
		}else if(result.length !=0 && (coursecodes.length != 0 || facultych.length != 0 || examslots.length != 0 )) {
			res.status(200).json({ message: 'dependencies found! Do you wish to delete the dependencies as well??', dependencies: {coursecodes,facultych,examslots}});
		}
		else{
			res.status(400).json({ message: 'no such username found' });
		}
		
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error });
	}
});

router.post('/deleteprofile', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can delete profile' });
	let { faculty_username } = req.body;
	try {
		let result = await query(`select * from profile where faculty_username = "${faculty_username}"`);
		let coursecodes = await query(`select coursecodes from subjectshandled where faculty_username="${faculty_username};"`);
		let facultych = await query(`select day,slot,dept,class,sem,academic_year from facultych where faculty_username="${faculty_username}"`);
		let examslots = await query(`select startdatetime, enddatetime,	subject, sem, type, academicyear, dep from examslots where faculty="${faculty_username}"`);
		if (result.length !=0 && coursecodes.length == 0 && facultych.length == 0 && examslots.length == 0 ) { 
			await query(`delete from profile where faculty_username = "${faculty_username}"`);
			await query(`delete from user where username = "${faculty_username}"`);
			await query(`delete from profilechangerequests where faculty_username = "${faculty_username}"`);
			res.status(200).json({ message: 'deletion of profile successful' });
		}else if(result.length !=0 && (coursecodes.length != 0 || facultych.length != 0 || examslots.length != 0 )) {
			await query(`delete from facultych where faculty_username="${faculty_username}"`);
			await query(`delete from examslots where faculty="${faculty_username}"`);
			await query(`delete from profile where faculty_username = "${faculty_username}"`);
			await query(`delete from subjectshandled where faculty_username = "${faculty_username}"`);
			await query(`delete from user where username = "${faculty_username}"`);
			await query(`delete from profilechangerequests where faculty_username = "${faculty_username}"`);
			res.status(200).json({ message: 'deletion of profile successful' });
		}
		else{
			res.status(400).json({ message: 'no such username found' });
		}
		
	} catch (error) {
		res.status(500).json({ message: error });
	}
});
module.exports = router;