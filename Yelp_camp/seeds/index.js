const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./sedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
  console.log('success to connection')
}).catch(err => {
  console.log('fail to connection')
  console.log(err)
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length)
    const price = Math.floor(Math.random() * 2000) + 1000
    const camp = new Campground({
      author: '66fbf79b13ab08cdb22cfb58',
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
      image: `https://images.unsplash.com/photo-1496947850313-7743325fa58c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXB8ZW58MHx8MHx8fDA%3D`,
      description: '木曽路はすべて山の中にある。',
      price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})