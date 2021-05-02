const { config } = require('chai');
const express = require('express');
const router = express.Router();
const { query } = require('../db');
const config = require('../../config.json');

router.post('/examscheduleinit', async (req, res) => {
  let { dept, sem } = req.body;
  try {
    let coursecodes = await query(`select coursecode from sem_course where dept like '${dept}' and sem like '${sem};`);
    let facutlies = await query(`select username, name from user where role like "faculty"`);
    return res.status(200).json({ coursecodes, faculties, examslottimings: config.examSlotTimings });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});