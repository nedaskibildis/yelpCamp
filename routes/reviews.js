const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressErrors')
const {reviewSchema} = require('../schemas.js')
const Campground = require('../models/campground')
const Review = require('../models/review')

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.mesage).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New Review Successfully Created')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router