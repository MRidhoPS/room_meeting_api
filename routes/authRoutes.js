const express = require('express');
const { signup, signupAdmin, login } = require('../controller/authController');
const { verifyToken } = require('../middleware/verifyToken')
const { checkRole } = require('../middleware/checkRole')

const router = express.Router();

router.post('/register', signup);

router.post('/admin/register', verifyToken, checkRole('owner'), signupAdmin);

router.post('/login', login);

module.exports = router;
