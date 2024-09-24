const express = require('express')
const morgan = require('morgan')
const app = express()

const AppError = require('./AppError')

// app.use(morgan('tiny'))

app.use((req, res, next) => {
  req.requestTime = Date.now()
  console.log(req.method, req.path)
  next()
})

app.use('/dogs', (req, res, next) => {
  console.log('いぬーーー！！')
  next()
})

const verifyPassword = (req, res, next) => {
  const {password} = req.query
  if (password === 'supersecret') {
    return next()
  }
  throw new AppError('パスワードが必要です。', 401)
}

// app.use((req, res, next) => {
//   console.log('初めてのミドルウェア')
//   return next()
// })

app.get('/', (req, res) => {
  res.send('ホームページ！！')
})

app.get('/error', (req, res) => {
  hoge.moge()
})

app.get('/dogs', (req, res) => {
  console.log(`リクエスト時刻：${req.requestTime}`)
  res.send('わんわん')
})

app.get('/secret', verifyPassword, (req, res) => {
  res.send('ここは秘密のページです。誰にも言わないで！！！')
})

app.get('/admin', (req, res) => {
  throw new AppError('管理者しかアクセスできません！', 403)
})

app.use((req, res) => {
  res.status(404).send('ページが見つかりません。')
})

// app.use((err, req, res, next) => {
//   console.log('**************error*************')
//   // res.status(500).send('エラーが発生しました。')
//   // console.log(err)
//   next(err)
// })

app.use((err, req, res, next) => {
  const {status = 500, message = '何かエラーが起きました。'} = err
  res.status(status).send(message)
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})