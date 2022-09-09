const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser);

router.route('/login')
    .get(users.renderLoginForm)
    .post(users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;