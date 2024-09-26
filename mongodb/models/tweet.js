const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/relationshipDemo').then(() => {
  console.log('success to connect mongodb!')
}).catch(err => {
  console.log('fail to conncet mongodb!')
  console.log(err)
})

const userSchema = new Schema({
  username: String,
  age: Number
})

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema)

// const makeTweets = () => {
//   const user = new User({username: 'yamada99', age: 61})
//   const tweet = new Tweet({ text: '今日は晴れてて気分がいい', likes: 0 })
//   tweet.user = user
//   user.save()
//   tweet.save()
// }
// makeTweets()

// const makeTweets = async () => {
//   const user = await User.findOne({username: 'yamada99'})
//   const tweet = new Tweet({text: 'ほげもげほげもげ', likes: 100, user})
//   tweet.save()
// }
// makeTweets()

const findTweet = async () => {
  const t = await Tweet.find().populate('user', 'username')
  console.log(t)
}

findTweet()