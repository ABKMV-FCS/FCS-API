let { query } = require('./db');
const config = require('../config.json');
const bcrypt = require('bcryptjs');

let seed_admins = async () => {

	for (let admin of config.admins) {
		try {
			let hashpassword = bcrypt.hashSync(admin.password, 12);
			await query(`INSERT INTO USER VALUES('${admin.username}','${hashpassword}','${admin.email}','admin','1234567890','admin')`);
			console.log(`${admin.username} created`);
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY')
				console.log(`${admin.username} already exists`);
			else
				console.log('error while seeding admins', error);
		}
	}
};

seed_admins();