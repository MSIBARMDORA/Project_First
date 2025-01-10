const express = require("express");
const router = express.Router();
const listingControllers = require("../controllers/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, listingValidation } = require("../middleware.js");
const Listing = require("../models/listing.js");
const { reviewValidation } = require("../middleware.js");


router.get("/test", (req, res) => {
    console.log(res.locals.userId);
});

module.exports = router;