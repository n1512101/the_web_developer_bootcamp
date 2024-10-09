const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

// https://res.cloudinary.com/dsw7zdm7p/image/upload/w_100/v1728476002/YelpCamp/tdkoxhedjpsblyuqwkzt.jpg

const imageSchema = new Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
})

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

campgroundSchema.post('findOneAndDelete', async (campground) => {
  if (campground) {
    await Review.deleteMany({_id: {$in: campground.reviews}})
  }
})

module.exports = mongoose.model('Campground', campgroundSchema)