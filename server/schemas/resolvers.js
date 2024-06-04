const { User, ReadyCheck, Notification } = require ('../models');
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

        getNotifications: async (parent, { userId }, context) => {
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
              throw new AuthenticationError('User not found');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect password');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },

        followFriend: async (parent, { username }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const hiFriend = await User.findOne({ username });
            if (!hiFriend) {
                throw new AuthenticationError('Friend not found');
            }

            const updatedFriend = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { 'profile.friends': friend._id }},
                { new: true },
            ).populate('profile.friends');

            await Notification.create({
                type: 'follow',
                sender: context.user._id,
                recipient: friend._id,
            });

            return updatedFriend;
        },

        unfollowFriend: async (parent, { username }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const byeFriend = await User.findOne({ username });
            if (!byeFriend) {
                throw new AuthenticationError('Friend not found');
            }

            const updatedFriend = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { friends: username }},
                { new: true },
            ).populate('profile.friends');

            await Notification.create({
                type: 'unfollow',
                sender: context.user._id,
                recipient: friend._id,
            });

            return updatedFriend

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
        },

        markNotificationAsRead: async (parent, { notificationId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { read: true },
                { new: true }
            ).populate('sender readyCheck');

            return notification;
        },

        deleteNotification: async (parent, { notificationId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const notification = await Notification.findByIdAndDelete(notificationId).populate('sender readyCheck');

            return notification;
        }
    }
}

module.exports = resolvers;