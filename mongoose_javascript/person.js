const mongoose = require('mongoose')
const {Schema} = mongoose

mongoose.connect('mongodb://localhost:27017/shopApp')
  .then(() => {
    console.log('connection ok!!!!!')
  })
  .catch(err => {
    console.log('connection error!!!')
    console.log(err)
  })

const personSchema = new Schema({
  first: String,
  last: String
})

personSchema.virtual('fullName').get(function() {
  return `${this.first} ${this.last}`
})

personSchema.pre('save', async function() {
  console.log('今から保存するよ！！！')
})

personSchema.post('save', async function() {
  console.log('保存したよ！！！')
})

const Person = mongoose.model('Person', personSchema)