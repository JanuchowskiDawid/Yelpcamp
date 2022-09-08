const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body.User;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash('success', 'welcome to yelpcamp');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'hallo again');
    res.redirect('/campgrounds');
})

module.exports = router;
