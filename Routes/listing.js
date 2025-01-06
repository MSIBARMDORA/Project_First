const express = require("express");
const router = express.Router();
const listingControllers = require("../controllers/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, listingValidation, reviewAuthor } = require("../middleware.js");
const Listing = require("../models/listing.js");
const { reviewValidation } = require("../middleware.js");

router
    .route("/")
    .get(wrapAsync(listingControllers.indexRoute))
    .post(wrapAsync(listingControllers.createListing));

router.get("/new", wrapAsync(listingControllers.newRoute));

router.post("/:id/reviews", isLoggedIn, reviewValidation, wrapAsync(listingControllers.reviewRoute));

router.delete("/:id/reviews/:reviewId", isLoggedIn, reviewAuthor, wrapAsync(listingControllers.reviewDestoryRoute));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editRoute));

router
    .route("/:id")
    .get(wrapAsync(listingControllers.showRoute))
    .put(isOwner, wrapAsync(listingControllers.updateRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteRoute));

module.exports = router;