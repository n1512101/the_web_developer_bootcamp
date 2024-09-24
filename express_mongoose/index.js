const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand')
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

app.get('/products', async (req, res) => {
  const { category } = req.query

  if (category) {
    const products = await Product.find({category})
    res.render('products/index', {products, category})
  } else {
    const products = await Product.find({})
    res.render('products/index', {products, category: '全'})
  }
})

app.get('/products/new', (req, res) => {
  res.render('products/new', {categories})
})

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
  const id = req.params.id
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  res.send(product._id)
})

app.delete('/products/:id', async (req, res) => {
  const {id} = req.params
  await Product.findByIdAndDelete(id)
  res.send()
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
