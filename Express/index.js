const express = require('express')
const path = require('path')
const {v4: uuid} = require('uuid')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

let comments = [
  {
    id: uuid(),
    username: 'yamada',
    comment: 'おもしろすぎ！！'
  },
  {
    id: uuid(),
    username: 'suzuki',
    comment: '趣味はハードウォッチング'
  },
  {
    id: uuid(),
    username: 'tanaka',
    comment: 'yamadaさん、何が面白いんですか'
  },
  {
    id: uuid(),
    username: 'wanwan',
    comment: 'わんわんわん'
  }
]

app.get('/comments', (req, res) => {
  res.render('comments/index', { comments })
})

app.get('/comments/new', (req, res) => {
  res.render('comments/new')
})

app.post('/comments', (req, res) => {
  const { username, comment } = req.body
  comments.push({
    username,
    comment,
    id: uuid()
  })
  res.redirect('/comments')
})

app.get('/comments/:id', (req, res) => {
  const { id } = req.params
  const comment = comments.find(c => c.id === id)
  res.render('comments/show', { comment })
})

app.get('/comments/:id/edit', (req, res) => {
  const {id} = req.params
  const comment = comments.find(c => c.id === id)
  console.log(comment)
  res.render('comments/edit', {comment})
})

app.patch('/comments/:id', (req, res) => {
  const {id} = req.params
  const newCommentText = req.body.comment
  const foundComment = comments.find(c => c.id === id)
  foundComment.comment = newCommentText
  res.send()
})

app.delete('/comments/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  comments = comments.filter(c => c.id !== id)
  res.end()
})

app.get('/tacos', (req, res) => {
  res.send('tacos get request')
})

app.post('/tacos', (req, res) => {
  const { meat, qty } = req.body
  res.send(`${qty} ${meat} どうぞ。`)
})

app.listen(3000, () => {
  console.log("server start")
})