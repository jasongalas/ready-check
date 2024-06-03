const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

userSchema.virtual('Friend Count').get(function() {
    return this.friends.length;
});

userSchema.methods.isCorrectPassword = async function (password) {
    await bcrypt.compare(password, this.password);
  };

const User = mongoose.model('User', userSchema);

module.exports = User;