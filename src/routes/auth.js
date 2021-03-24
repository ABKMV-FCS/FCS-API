const express = require('express');
const router = express.Router();
const { query } = require('./db');
const verifyJWT = require('./helpers/verify_jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config.json');

let createJWT = (record, expiresIn) => {
	let { username, email, role } = record;
	return jwt.sign({ username, email, role }, config.jwt_secret, { expiresIn });
};

app.post('/login', async (req, res) => {
	let { username, password } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		if (!bcrypt.compareSync(password, result[0].password)) { return res.status(400).json({ message: 'username/password incorrect' }); }
		let token = createJWT(result[0], '24h');
		res.status(200).json({ token, message: 'Logged in successfully!' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/register', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	let { username, password, email, role } = req.body;
	try {
		password = bcrypt.hashSync(password, 12);
		await query(`INSERT INTO USER VALUES('${username}','${password}','${email}','${role}')`);
		res.status(200).json({ message: 'Registered Successfully!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(400).json({ message: 'username already taken' });
		}
		res.status(500).json({ message: error });
	}
});

app.post('/forceremoveuser', verifyJWT, async (req, res) => {

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

app.post('/forgotpassword', async (req, res) => {
	let { username } = req.body.username;
	try {
		let user = await query(`SELECT * FROM USER WHERE USERNAME LIKE '${username}'`);
		if (user.length == 0)
			return res.status(400).json({ message: 'Invalid username!' });
// 
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

module.exports = router;