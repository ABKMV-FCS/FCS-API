const express = require('express');
const router = express.Router();
const verifyJWT = require('./helpers/verify_jwt');

router.use('/auth', require('./routes/auth'))
router.use('/profile', verifyJWT, require('./routes/profile'))
router.use('/timetable', verifyJWT, require('./routes/timetable'))
router.use('/calendar', verifyJWT, require('./routes/calendar'))
router.use('/examschedule', verifyJWT, require('./routes/examschedule'))
router.use('/emergencyholiday', verifyJWT, require('./routes/emergencyholiday'))
module.exports = router;