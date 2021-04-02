const express = require('express');
const router = express.Router();
const verifyJWT = require('./helpers/verify_jwt');

router.use('/auth',require('./routes/auth'))
router.use('/profile',verifyJWT,require('./routes/profile'))
module.exports=router;