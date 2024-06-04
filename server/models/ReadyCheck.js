const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const readyCheckSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
        trim: true
    },
    description: {
        type: String,
        required: false,
        minLength: 1,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp)
    },
    attendees: [{
        user: {
            type: Schema.Types.ObjectId, 
            ref:'User',
            required: true
        },
        status: {
            type: String,
            enum: ['accepted', 'denied', 'pending'],
            default: 'pending'
        }
    }]
});

const ReadyCheck = model('ReadyCheck', readyCheckSchema);
module.exports = ReadyCheck;