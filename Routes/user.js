const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



router
    .route("/signup")
    .get(userControllers.userSignupRoute)
    .post(wrapAsync(userControllers.userSignPostRoute));

router
    .route("/login")
    .get(userControllers.userLoginRoute)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), (userControllers.userLoginPostRoute));


router.get("/logout", (userControllers.userLogoutRoute));

module.exports = router;