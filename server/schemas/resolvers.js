const { User, ReadyCheck } = require ('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        getUser: async (parent, _,context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
                }
            return User.findById({ _id: context.user._id }).populate('profile.friends');
            }
        },
        getReadyCheck: async (parent, { id }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }
            return ReadyCheck.findById(id).populate('attendees.user');
        },
        getFriends: async (parent, { userId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }
            const user = await User.findById(userId).populate('profile.friends');
            return user.profile.friends;
        },
        me: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }
            return User.findById(context.user._id).populate('profile.friends');
        },
        notifications: async (parent, { userId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }
            return Notification.find({ recipient: userId }).populate('sender readyCheck');
        },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser);
            return { token, newUser };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
        followFriend: async (parent, { username }, context) => {
            const hiFriend = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { friends: username }},
                { new: true },
            ).populate('profile.friends');
            return hiFriend;
        },
        unfollowFriend: async (parent, { username }, context) => {
            const byeFriend = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { friends: username }},
                { new: true },
            ).populate('profile.friends');
            return byeFriend;
        },
        createReadyCheck: async (parent, { title, description }, context) => {
            const data = await ReadyCheck.create(
                { _id: context.user._id },
                { $addToSet: { readyCheck: { title, description } } },
                { new: true },
            )
            return data;
        },
        updateReadyCheck: async (parent, { title, description }, context) => {
            const updatedData = await ReadyCheck.findOneAndUpdate(
                { _id: context.readyCheck._id },
                { $set: { readyCheck: { title, description } } },
                { new: true },
            )
            return updateData;
        },
        updateUserStatus: async (parent, { status }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $set: { status } },
                { new: true }
            ).populate('profile.friends');

            return updatedUser;
        }

    }
}

module.exports = resolvers;