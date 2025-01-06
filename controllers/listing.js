const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



//Index Route
module.exports.indexRoute = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

//Show Route
module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing Does Not Exit!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listing });
};

//new Route
module.exports.newRoute = async (req, res) => {
    res.render("listings/new.ejs");
};

// Create Listing
module.exports.createListing = async (req, res) => {
    console.log("Request Body:", req.body); // Debugging statement
    if (!req.body.listing) {
        console.error("Listing data is missing in the request body");
        req.flash("error", "Listing data is missing");
        return res.redirect("/listings/new");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully New Listing Created!");
    res.redirect("/listings");
};

//Edit Route
module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing Does Not Exit!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

//Update Route
module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    let listing = Listing.findById(id);
    if (!listing.owner.equals(req.locals.curUser)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/lisitngs/${id}`);
    };
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully Edit Listing");
    res.redirect(`/listings/${id}`);
};

//Delete listingRoute
module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("destory", "Successfully Deleted Listing!");
    res.redirect("/listings");
};

//Reviews addRoute
module.exports.reviewRoute = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

//Review Destory Route
module.exports.reviewDestoryRoute = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("destory", "Successfully Deleted Review!");
    res.redirect(`/listings/${id}`);
};
