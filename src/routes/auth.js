const express = require('express');
const router = express.Router();
const { query } = require('../db');
const verifyJWT = require('../helpers/verify_jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config.json');
const mailer = require('../helpers/mailer');
const { response } = require('express');
var admin = require("firebase-admin");

var serviceAccount = require("../../firebasecreds/facultycalendarscheduler-firebase-adminsdk-s1kqm-24a6ba3f82.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

var bouncer = require("express-bouncer")(500, 900000);
bouncer.whitelist.push("127.0.0.1");
bouncer.blocked = function (req, res, next, remaining) {
	res.status(429).json({ message: "Too many requests have been made, please wait " + remaining / 1000 + " seconds" });
};

let createJWT = (record, expiresIn) => {
	let { username, email, role } = record;
	return jwt.sign({ username, email, role }, config.jwt_secret, { expiresIn });
};

router.post('/login', async (req, res) => {
	let { username, password, staysignedin } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		if (!bcrypt.compareSync(password, result[0].password)) { return res.status(400).json({ message: 'username/password incorrect' }); }
		if(!staysignedin) {
			let token = createJWT(result[0], '24h');
			res.status(200).json({ token, name: result[0].name, role: result[0].role, message: 'Logged in successfully!', expiration: 24*60 });
		}
		else {
			let token = createJWT(result[0], '365d');
			res.status(200).json({ token, name: result[0].name, role: result[0].role, message: 'Logged in successfully!', expiration: -1 });
		}
	} catch (error) {
		res.status(500).json({ message: error });
	}
});
router.post('/googlelogin', async (req, res) => {
	let { idToken,staysignedin } = req.body;
	try {
		let email=''
		try {
			let decodedToken = await admin
				.auth()
				.verifyIdToken(idToken.i);
				email=decodedToken.email;
				if(!decodedToken.email_verified) throw Error()
			} catch (error) {
				console.log(error);
				throw Error('Invalid gmail login')
			}
		let result = await query(`SELECT * FROM USER WHERE email LIKE '${email}'`);

		if (result.length == 0) { res.status(400).json({ message: 'username not found' }); return; }
		if(!staysignedin) {
			let token = createJWT(result[0], '24h');
			res.status(200).json({ token, name: result[0].name, role: result[0].role, message: 'Logged in successfully!', expiration: 24*60 });
		}
		else {
			let token = createJWT(result[0], '365d');
			res.status(200).json({ token, name: result[0].name, role: result[0].role, message: 'Logged in successfully!', expiration: -1 });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/register', verifyJWT, async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can register users' });
	let { username, password, email, name, role, phone, qualifications, profilephoto } = req.body;
	try {
		password = bcrypt.hashSync(password, 12);
		await query(`INSERT INTO USER VALUES('${username}','${password}','${email}','${role}','${phone}','${name}','true','${profilephoto}','${qualifications}')`);
		let message = 'Registered Successfully!';
		if (await mailer(email, `Successfully registered user:${username}`, 'ABKMV-Faculty Calendar Scheduler account creation'))
			message += ' Confirmation mail sent.';
		res.status(200).json({ message });
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

router.post('/forgotpassword', async (req, res) => {
	let { username } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${username}'`);
		if (result.length == 0)
			return res.status(400).json({ message: 'Invalid username!' });
		let token = createJWT(result[0], '24h');
		let { email } = result[0];
		let reset_link = `${config.hostname}/resetpassword?token=${token}`;
		let mailTxt = `<b>Click the given link to login and reset your password<br><br></b><a href="${reset_link}">${reset_link}</a>`;
		let subject = "ABKMV-Faculty Calendar Scheduler Password Recovery";
		if (await mailer(email, mailTxt, subject))
			return res.status(200).json({ message: 'Password reset instructions sent to mail' });
		else
			return res.status(500).json({ message: 'Error sending mail to corresponding username' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/check-jwt', async (req, res) => {
	let { token } = req.body;
	try {
		jwt.verify(token, config.jwt_secret, (err, tokenDetails) => {
            if (err) {
                return res.status(403).json({message:'Unauthorized'});
            }
            req.tokenDetails = tokenDetails;
        });
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${req.tokenDetails.username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'Token username not found' }); return; }
		res.status(200).json({ username: result[0].username,name: result[0].name, role: result[0].role, message: 'Token Valid!', expiration: 24*60 });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/resetpassword', verifyJWT, async (req, res) => {
	let { password } = req.body;
	try {
		let result = await query(`SELECT * FROM USER WHERE username LIKE '${req.tokenDetails.username}'`);
		if (result.length == 0) { res.status(400).json({ message: 'User not found' }); return; }
		password = bcrypt.hashSync(password, 12)
		await query(`UPDATE USER SET password = '${password}' WHERE username='${req.tokenDetails.username}';`);
		res.status(200).json({message: 'Password Reset Success!'});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

module.exports = router;