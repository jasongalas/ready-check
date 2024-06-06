const { Schema, model } = require('mongoose');

const rsvpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reply: {
    type: String,
    enum: ['accepted', 'declined', 'pending'],
    default: 'pending',
  },
});

const RSVP = model('RSVP', rsvpSchema);

module.exports = RSVP;
