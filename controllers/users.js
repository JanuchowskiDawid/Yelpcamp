const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.registerUser = catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body.User;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'welcome to yelpcamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
})

module.exports.loginUser = passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'hallo again');
    const nextStep = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(nextStep);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
};