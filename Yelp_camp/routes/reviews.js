const express = require('express')
const router = express.Router({mergeParams: true})
const { reviewSchema } = require('../schemas')
const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = err.details.map(detail => detail.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await campground.save()
  await review.save()
  req.flash('success', 'レビューを登録しました')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const {id, reviewId} = req.params
  await Review.findByIdAndDelete(reviewId)
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  req.flash('success', 'レビューを削除しました')
  res.redirect(`/campgrounds/${id}`)
}))

module.exports = router