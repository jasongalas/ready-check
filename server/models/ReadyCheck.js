const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const readyCheckSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
    trim: true,
  },
  activity: {
    type: String,
    trim: true,
  },
  timing: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    minLength: 1,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  invitees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }],
  RSVPs: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    reply: {
      type: String,
      enum: ['accepted', 'declined', 'maybe', 'pending'],
      default: 'pending',
    },
  }],
});

const ReadyCheck = model('ReadyCheck', readyCheckSchema);

module.exports = ReadyCheck;
