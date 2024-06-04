const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readyCheck: {
    type: Schema.Types.ObjectId,
    ref: 'ReadyCheck',
    required: false
  }
});

const Notification = model('Notification', notificationSchema);
module.exports = Notification;
