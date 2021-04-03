const express = require('express');
const router = express.Router();
const { query } = require('../db');
const verifyJWT = require('../helpers/verify_jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config.json');
const mailer = require('../helpers/mailer');
const { response } = require('express');

let createJWT = (record, expiresIn) => {
	let { username, email, role } = record;
	return jwt.sign({ username, email, role }, config.jwt_secret, { expiresIn });
};

router.post('/login', async (req, res) => {
	let { username, password } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		if (!bcrypt.compareSync(password, result[0].password)) { return res.status(400).json({ message: 'username/password incorrect' }); }
		let token = createJWT(result[0], '24h');
		res.status(200).json({ token, name: result[0].name, role: result[0].role, message: 'Logged in successfully!', expiration: 24*60 });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/register', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	let { username, password, email, name, role, phone, qualifications, profilephoto } = req.body;
	try {
		password = bcrypt.hashSync(password, 12);
		await query(`INSERT INTO USER VALUES('${username}','${password}','${email}','${role}','${phone}','${name}','true',${profilephoto},'${qualifications}')`);
		res.status(200).json({ message: 'Registered Successfully!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(400).json({ message: 'username already taken' });
		}
		res.status(500).json({ message: error });
	}
});

router.post('/forceremoveuser', verifyJWT, async (req, res) => {

	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can forceremove users' });
	let { username } = req.body;
	try {
		await query(`DELETE FROM USER WHERE USERNAME LIKE '${username}'`);
		res.status(200).json({ message: "User removed successfully" });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/staysignedin', verifyJWT, async (req, res) => {
	res.status(200).json({ token: createJWT(req.tokenDetails, '365d') });
});

router.post('/forgotpassword', async (req, res) => {
	let { username } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0)
			return res.status(400).json({ message: 'Invalid username!' });
		let token = createJWT(result[0], '24h');
		let { email } = result[0];
		if (mailer(email, `${config.hostname}/resetpassword?token=${token}`))
			return res.status(200).json({ message: 'Password reset instructions sent to mail' });
		else
			return res.status(500).json({ message: 'Error sending mail to corresponding username' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

module.exports = router;