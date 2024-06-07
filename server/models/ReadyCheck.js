const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const chatMessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

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
    get: (timestamp) => dateFormat(timestamp),
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
      enum: ['Ready', 'Declined', 'Maybe', 'Pending'],
      default: 'Pending',
    },
  }],
  chatMessages: [chatMessageSchema], 
});

const ReadyCheck = model('ReadyCheck', readyCheckSchema);

module.exports = ReadyCheck;
