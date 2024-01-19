const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.logIn = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.renderlogIn = (req, res) => {
    res.render('users/login');
}

module.exports.logOut = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Handle error, if any
        }
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/campgrounds');
    });
}
