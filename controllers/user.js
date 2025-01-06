const User = require("../models/user.js");

//User SignupRouter
module.exports.userSignupRoute = (req, res) => {
    res.render("user/signup.ejs");
};

//User SignupRoutetr 
module.exports.userSignPostRoute = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const register = await User.register(newUser, password);
        req.login(register, (err) => {
            if (err) {
                return next(err);
            };
            req.flash("success", "Welcome To Traveling");
            res.redirect("/listings");
        });
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings/signup");
    };
};

//User LoginRoute
module.exports.userLoginRoute = (req, res) => {
    res.render("user/login.ejs");
};

//User LoginpostRoute
module.exports.userLoginPostRoute = async (req, res) => {
    req.flash("success", "Welcome back to traveling");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//User LogoutRoute
module.exports.userLogoutRoute = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};