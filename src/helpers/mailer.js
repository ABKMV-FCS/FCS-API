const nodemailer = require('nodemailer');
const config = require('../../config.json');

const emailTransporter = nodemailer.createTransport({
	host: 'smtp.mail.yahoo.com',
	port: 465,
	service: 'yahoo',
	secure: true,
	auth: config.emailAuth,
	debug: false,
	logger: false,
	// tls: {
	// 		rejectUnauthorized: false
	// }
});


async function mailer(email, mailTxt, subject) {
	try {
		await emailTransporter.sendMail({
			from: `"Faculty Calendar Scheduler - ABKMV" <${config.emailAuth.user}>`,
			to: email,
			subject,
			html: mailTxt
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

module.exports = mailer;
