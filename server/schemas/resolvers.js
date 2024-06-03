const { User, ReadyCheck } = require ('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        getUser: async (parent, _,context) => {
            return Thought.findById({ _id: context.user._id });
        }
    },

    Mutation: {
        createUser: async (parent, { userName, email, password }) => {
            const newUser = await User.create({ userName, email, password });
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
    }
}

module.exports = resolvers;