const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')
const AppError = require('./AppError')

mongoose.connect('mongodb://localhost:27017/farmStand2')
  .then(() => {
    console.log('MongoDB connection OK!!')
  }).catch((err) => {
    console.log('MongoDB connection error!!')
    console.log(err)
  })

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

const categories = ['果物', '野菜', '乳製品']

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res).catch(err => next(err))
  }
}

app.get('/products', async (req, res, next) => {
  try {
    const { category } = req.query
  
    if (category) {
      const products = await Product.find({category})
      res.render('products/index', {products, category})
    } else {
      const products = await Product.find({})
      res.render('products/index', {products, category: '全'})
    }
  } catch (error) {
    next(error)
  }
})

app.get('/products/new', (req, res) => {
  res.render('products/new', {categories})
})

app.post('/products', wrapAsync(async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect(`/products/${newProduct._id}`)
}))

app.get('/products/:id', wrapAsync(async (req, res) => {
  const { id } = req.params
  // ObjectIdのバリデーション
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('無効な商品IDです。', 400); // 400 Bad Request
  }
  const product = await Product.findById(id)
  if (!product) {
    throw new AppError('商品が見つかりません。', 404)
  }
  res.render('products/show', { product })
}))

app.get('/products/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params
      // ObjectIdのバリデーション
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('無効な商品IDです。', 400); // 400 Bad Request
      }
    const product = await Product.findById(id)
    if (!product) {
      throw new AppError('商品が見つかりません。', 404)
    }
    res.render('products/edit', { product, categories })
  } catch (error) {
    next(error)
  }
})

app.put('/products/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.send(product._id)
  } catch (error) {
    next(error)
  }
})

app.delete('/products/:id', async (req, res) => {
  const {id} = req.params
  await Product.findByIdAndDelete(id)
  res.send()
})

app.use((err, req, res, next) => {
  console.log(err.name)
  next(err)
})

app.use((err, req, res, next) => {
  const {status = 500, message = '問題が発生しました'} = err
  // res.status(status).send(message)
  res.send(message)
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
