const nodemailer = require('nodemailer');
const config = require('../../config.json');

const emailTransporter = nodemailer.createTransport({
	host: 'smtp.mail.yahoo.com',
	port: 465,
	service: 'yahoo',
	secure: true,
	auth: config.emailAuth,
	debug: false,
	logger: false
});


async function mailer(email,reset_link) {
	try {
		let mailTxt=`<b>Click the given link to login and reset your password<br><br></b><a href="${reset_link}">${reset_link}</a>`
		await emailTransporter.sendMail({
			from: `"Faculty Calendar Scheduler - ABKMV" <${config.emailAuth.user}>`,
			to: email,
			subject: "ABKMV-Faculty Calendar Scheduler Password Recovery",
			html: mailTxt
		});
		return true
	} catch (error) {
		return false
	}
}

module.exports=mailer
