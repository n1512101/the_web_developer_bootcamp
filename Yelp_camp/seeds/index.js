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
      description: '木曽路はすべて山の中にある。',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dsw7zdm7p/image/upload/v1728388312/YelpCamp/zk4ksptwk9gmpv3id2rb.jpg',
          filename: 'YelpCamp/zk4ksptwk9gmpv3id2rb',
        },
        {
          url: 'https://res.cloudinary.com/dsw7zdm7p/image/upload/v1728388313/YelpCamp/bw8whdevaddpkrb0h2tv.jpg',
          filename: 'YelpCamp/bw8whdevaddpkrb0h2tv',
        }
      ]
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})