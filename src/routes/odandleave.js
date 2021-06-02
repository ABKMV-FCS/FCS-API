const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');

router.get('/getslotdetails', async (req, res) => {
    try {
        return res.status(200).json({ slots: config.slots, message: 'Fetched Slot Details Successfully!' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

router.post('/requestod', async (req, res) => {
    let { username } = req.tokenDetails;
    let { reason, date, fromslot, toslot } = req.body;
    try {
        let result = await query(`insert INTO odrequest VALUES('${username}','${date}','${fromslot}','${toslot}','${reason}','pending')`);
		if (result.affectedRows > 0) {
			return res.status(200).json({ message: 'Request sent Successfully!' });
		}
		else {
			return res.status(500).json({ message: 'error occurred while requesting od!' });
		}
    } catch (error) {
        if(error.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Request Already Sent!" });
        return res.status(500).json({ message: error });
    }
});

router.get('/showodrequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can see od requests' });
	try {
		let result = await query(`SELECT * FROM odrequest where status like 'pending'`);
		if (result.length == 0) {
			return res.status(200).json({ message: 'No Requests so far!' });
		} else {
			return res.status(200).json({ requests: result });
		}

	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/acceptodrequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can accept request' });
	let { faculty } = req.body;
	try {
		let result = (await query(`select * FROM odrequest where faculty like '${faculty}' and status like 'pending';`));
		if (result.length == 0) return res.status(400).json({ message: 'No Requests Found!' });
		let { date, fromslot, toslot, reason } = result[0];
		await query(`UPDATE odrequest SET status='approved' WHERE faculty like '${faculty}' and date like '${date}' and fromslot like '${fromslot}' and toslot like '${toslot}' and reason like '${reason}';`);
		res.status(200).json({ message: 'OD Request Accepted successfully!' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});

router.post('/rejectodrequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can reject request' });
	let { faculty } = req.body;
	try {
		let result = (await query(`select * FROM odrequest where faculty like '${faculty}' and status like 'pending';`));
		if (result.length == 0) return res.status(400).json({ message: 'No Requests Found!' });
		let { date, fromslot, toslot, reason } = result[0];
		await query(`UPDATE odrequest SET status='rejected' WHERE faculty like '${faculty}' and date like '${date}' and fromslot like '${fromslot}' and toslot like '${toslot}' and reason like '${reason}';`);
		res.status(200).json({ message: 'OD Request Rejected successfully!' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/requestleave', async (req, res) => {
    let { username } = req.tokenDetails;
    let { reason, fromdate, todate, fromslot, toslot } = req.body;
    try {
        let result = await query(`insert INTO leaverequest VALUES('${username}','${fromdate}','${todate}','${fromslot}','${toslot}','${reason}','pending')`);
		if (result.affectedRows > 0) {
			return res.status(200).json({ message: 'Request sent Successfully!' });
		}
		else {
			return res.status(500).json({ message: 'error occurred while requesting leave!' });
		}
    } catch (error) {
        if(error.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Request Already Sent!" });
        return res.status(500).json({ message: error });
    }
});

router.get('/showleaverequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can see leave requests' });
	try {
		let result = await query(`SELECT * FROM leaverequest where status like 'pending'`);
		if (result.length == 0) {
			return res.status(200).json({ message: 'No Requests so far!' });
		} else {
			return res.status(200).json({ requests: result });
		}

	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

router.post('/acceptleaverequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can accept request' });
	let { faculty } = req.body;
	try {
		let result = (await query(`select * FROM leaverequest where faculty like '${faculty}' and status like 'pending';`));
		if (result.length == 0) return res.status(400).json({ message: 'No Requests Found!' });
		let { fromdate, todate, fromslot, toslot, reason } = result[0];
		await query(`UPDATE leaverequest SET status='approved' WHERE faculty like '${faculty}' and fromdate like '${fromdate}' and todate like '${todate}' and fromslot like '${fromslot}' and toslot like '${toslot}' and reason like '${reason}';`);
		res.status(200).json({ message: 'Leave Request Accepted successfully!' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error });
	}
});

router.post('/rejectleaverequest', async (req, res) => {
	if (req.tokenDetails.role !== 'admin')
		return res.status(400).json({ message: 'only admin can reject request' });
	let { faculty } = req.body;
	try {
		let result = (await query(`select * FROM leaverequest where faculty like '${faculty}' and status like 'pending';`));
		if (result.length == 0) return res.status(400).json({ message: 'No Requests Found!' });
		let { fromdate, todate, fromslot, toslot, reason } = result[0];
		await query(`UPDATE leaverequest SET status='rejected' WHERE faculty like '${faculty}' and fromdate like '${fromdate}' and todate like '${todate}' and fromslot like '${fromslot}' and toslot like '${toslot}' and reason like '${reason}';`);
		res.status(200).json({ message: 'Leave Request Rejected successfully!' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

module.exports = router;