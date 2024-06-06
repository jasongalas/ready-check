const { Schema, model } = require('mongoose');
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
  status: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 140,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ownedReadyChecks: [{
    type: Schema.Types.ObjectId,
    ref: 'ReadyCheck',
  }],
  receivedReadyChecks: [{
    type: Schema.Types.ObjectId,
    ref: 'ReadyCheck',
  }]
});

userSchema.methods.isCorrectPassword = async function (password) {
  await bcrypt.compare(password, this.password);
};

userSchema.virtual('Following').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;