const { User, ReadyCheck } = require ('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        getUser: async (parent, _,context) => {
            return Thought.findById({ _id: context.user._id });
        }
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
            )
            return hiFriend;
        },
        unfollowFriend: async (parent, { username }, context) => {
            const byeFriend = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { friends: username }},
                { new: true },
            )
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
    }
}

module.exports = resolvers;