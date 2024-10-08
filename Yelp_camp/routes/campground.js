const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')
const {isLoggedIn} = require('../middleware')

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(detail => detail.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}



router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
  if (!campground) {
    req.flash('error', 'キャンプ場が見つかりませんでした')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)
  req.flash('success', '新しいキャンプ場を登録しました')
  const campground = new Campground(req.body.campground)
  campground.author = req.user._id
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const id = req.params.id
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'キャンプ場が見つかりませんでした')
    return res.redirect('/campgrounds')
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', '更新する権限がありません')
    return res.redirect(`/campgrounds/${id}`)
  }
  res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const id = req.params.id
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', '更新する権限がありません')
    return res.redirect(`/campgrounds/${id}`)
  }
  await Campground.updateOne({_id: id}, req.body.campground)
  req.flash('success', 'キャンプ場を更新しました')
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'キャンプ場を削除しました')
  res.redirect('/campgrounds')
}))

module.exports = router