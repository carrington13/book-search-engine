const { AuthenicationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');
                
                return userData;
            }
            // if not logged in(!context.user)
            throw new AuthenicationError('Not logged in');
        }
    },

    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            // If email findOne fails, throw ambiguous error
            if (!user) {
                throw new AuthenicationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            // If password fails, throw same ambiguous error
            if (!correctPw) {
                throw new AuthenicationError('Incorrect credentials');
            }
            
            // if user && correctPw pass if conditionals, create a JWT
            const token = signToken(user);
            // and return token and user
            return { token, user };

        },
        addUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            // after sign up successful, return JWT and user to log them in
            return {token, user}
        },
        saveBook: async (_, args, context) => {
            if(context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }
            // if context doesnt exist....
            throw new AuthenicationError('You need to be logged in!');
        },
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }
            // if context(user) doesnt exist...
            throw new AuthenicationError('You need to be logged in!');

        }

    }
};

module.exports = resolvers