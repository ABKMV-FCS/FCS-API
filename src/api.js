const express = require('express');
const router = express.Router();
const verifyJWT = require('./helpers/verify_jwt');

router.use('/auth', require('./routes/auth'))
router.use('/profile', verifyJWT, require('./routes/profile'))
router.use('/timetable', require('./routes/timetable'))
router.use('/calendar', verifyJWT, require('./routes/calendar'))
router.use('/student', require('./routes/student'))
router.use('/examschedule',require('./routes/examschedule'))
router.use('/odandleave', verifyJWT, require('./routes/odandleave'))
router.use('/emergencyholiday', verifyJWT, require('./routes/emergencyholiday'))
router.use('/analytics', verifyJWT, require('./routes/analytics'))
module.exports = router;