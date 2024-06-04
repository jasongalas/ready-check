const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
    status: {
        type: String,
        required: true,
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
      }]
      
});

userSchema.virtual('Following').get(function() {
    return this.friends.length;
});

const Profile = model('Profile', profileSchema);
module.exports = Profile;