const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.post('/createnewholiday', async (req, res) => {
    let { date, description } = req.body;
    try {
        await query(`insert into holiday values ('${date}','${reason}');`);
        await query(`delete from calendar where date like '${date}';`);
        return res.status(200).json({ message: 'deletion successful' });

    } catch (error) {
        return res.status(500).json({ message: error });
    }
});