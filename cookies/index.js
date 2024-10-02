const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser('mysecret'))

app.get('/greet', (req, res) => {
  const {name = anonymous} = req.cookies
  res.send(`hello, ${name}`)
})

app.get('/setname', (req, res) => {
  res.cookie('name', 'yamada')
  res.send('ok')
})

app.get('/getsignedcookie', (req, res) => {
  res.cookie('fruit', 'grape', {signed: true})
  res.send('getsignedcookie')
})

app.get('/verifyfruits', (req, res) => {
  console.log(req.cookies)
  console.log(req.signedCookies)
  res.send(req.signedCookies)
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})