const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be login to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        return res.locals.redirect = req.session.redirectUrl;
    };
    next();
};

module.exports.isOwne = async (req, res, next) => {
    let { id } = req.params;
    let listing = Listing.findById(id);
    if (!listing.owner.equals(req.locals.curUser)) {
        req.flash("error", "You not the owner of this lisitng");
        return res.redirect(`/lisitngs/${id}`);
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect('/listings');
    }
    if (!res.locals.curUser || !listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You do not have permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//listing validation
module.exports.listingValidation = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else { next() };
};

//Review validation
module.exports.reviewValidation = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else { next() };
};

//Review Destory Author
module.exports.reviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = Review.findById(reviewId);
    if (!review.author.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};