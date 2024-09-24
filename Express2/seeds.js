const mongoose = require('mongoose')
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand2')
  .then(() => {
    console.log('MongoDB connection OK!!')
  }).catch((err) => {
    console.log('MongoDB connection error!!')
    console.log(err)
  })

// const p = new Product({
//   name: 'ルビーグレープフルーツ',
//   price: 198,
//   category: '果物'
// })

// p.save().then(data => {
//   console.log(data)
// }).catch(err => {
//   console.log(err)
// })

const seedProducts = [
  {
    name: 'ナス',
    price: 98,
    category: '野菜'
  },
  {
    name: 'カットメロン',
    price: 480,
    category: '果物'
  },
  {
    name: '種なしスイカのカット',
    price: 380,
    category: '果物'
  },
  {
    name: 'オーガニックセロリ',
    price: 198,
    category: '野菜'
  },
  {
    name: 'コーヒー牛乳',
    price: 298,
    category: '乳製品'
  },
]

Product.insertMany(seedProducts)
.then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

