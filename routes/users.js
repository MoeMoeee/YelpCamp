const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeURL } = require('../middleware');
const user = require('../controllers/users');

// render register page
router.get('/register', user.renderRegister);

// send post req register new users
router.post('/register', catchAsync(user.registerUser));

// render login page
router.get('/login', user.renderlogIn)

// send post request to log users in 
router.post('/login', storeURL ,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.logIn)

// log users out
router.get('/logout', user.logOut);


module.exports = router;