const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const { storeURL } = require('../middleware');

// render register page
router.get('/register', (req, res) => {
    res.render('users/register');
});

// send post req register new users
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

// render login page
router.get('/login', (req, res) => {
    res.render('users/login');
})

// send post request to log users in 
router.post('/login', storeURL ,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Handle error, if any
        }
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/campgrounds');
    });
});


module.exports = router;