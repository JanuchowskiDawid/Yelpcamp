const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');

router.get('/register', users.renderRegisterForm);

router.get('/login', users.renderLoginForm);

router.post('/register', users.registerUser);

router.post('/login', users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;