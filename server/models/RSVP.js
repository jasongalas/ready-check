const { Schema, model } = require('mongoose');

const rsvpSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  readyCheck: {
    type: Schema.Types.ObjectId,
    ref: 'ReadyCheck',
    required: true,
  },
  status: {
    type: String,
    enum: ['accepted', 'declined', 'pending'],
    default: 'pending',
  },
});

const RSVP = model('RSVP', rsvpSchema);

module.exports = RSVP;
