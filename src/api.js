const express = require('express');
const router = express.Router();

router.use('/auth',require('./routes/auth'))
router.use('/profile',require('./routes/profile'))
module.exports=router;