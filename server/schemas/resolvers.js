// apollo server express
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password" );
        return userData; }
      throw new AuthenticationError("Not logged in, please try again"); },
  },

  Mutation: {
    //ADD_USER will execute the addUser mutation.
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user }; },
    login: async (parent, { email, password }) => {const user = await User.findOne({ email });

      if (!user) {throw new AuthenticationError("Incorrect credentials, please try again");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {throw new AuthenticationError("Incorrect credentials, please try again");
      }

      const token = signToken(user);
      return { token, user };
    },
    //SAVE_BOOK will execute the saveBook mutation.


    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }

      throw new AuthenticationError("You have  to be logged in! please try again");
    },
    //REMOVE_BOOK will execute the removeBook mutation.


    removeBook: async (parent, { bookId }, context) => {
      if (context.user) 
      console.log(context.user);
      {const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        console.log(updatedUser);

        return updatedUser;
      }

      throw new AuthenticationError("You have to be logged in!");
    },
  },
};

module.exports = resolvers;
