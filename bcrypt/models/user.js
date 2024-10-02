const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'usernameは必須です']
  },
  password: {
    type: String,
    required: [true, 'passwordは必須です']
  }
}, {
  statics: {
    async findAndValidate(username, password) {
      const user = await this.findOne({username})
      const isValid = await bcrypt.compare(password, user.password)
      return isValid ? user : false
    }
  }
})

userSchema.pre('save', async function (next) {
  // passwordが編集されたときのみ最後まで実行
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

module.exports = mongoose.model('User', userSchema)