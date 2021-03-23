const express = require('express');
const bodyParser = require('body-parser');
const { query, connect } = require('./db');
const cors = require('cors');
const morgan = require('morgan');
const verifyJWT = require('./helpers/verify_jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const config = require('../config.json');



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

connect(function (err) {
	console.log(`connected to SQL Server`);
	require('./app_init');
});

app.post('/login', async (req, res) => {
	let { username, password } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		if (!bcrypt.compareSync(password, result[0].password)) { res.status(400).json({ message: 'username/password incorrect' }); return; }
		let { email, role } = result[0];
		let token = jwt.sign({ username, email, role }, config.jwt_secret, { expiresIn: '24h' });
		res.status(200).json({ token, message: 'Logged in successfully!' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/register', verifyJWT, async (req, res) => {
	// console.log(req.tokenDetails);
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

app.post('/forceremoveuser', async (req, res) => {
	let { username } = req.body;
	try {
		await query(`DELETE FROM USER WHERE USERNAME LIKE '${username}'`);
		res.status(200).json({ message: "User removed successfully" });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));