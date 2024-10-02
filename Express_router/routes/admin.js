const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  if (req.query.isadmin) {
    return next()
  } else {
    res.send('not admin!!!')
  }
})

router.get('/secret', (req, res) => {
  res.send('secret!!!!!')
})

router.get('/deleteall', (req, res) => {
  res.send('deleted all!!!!')
})

module.exports = router