const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { User } = require("../models");

module.exports = {
  Query: {
    //// GET ALL USERS
    getUsers: async (_, __, context) => {
      try {
        let user;

        // Get token from headers
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split(" ")[1];
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }

            user = decodedToken;
          });
        }

        // Get all users except authenticated user
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    //// LOGIN
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};

      try {
        // Handle Input
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad input", { errors });
        }

        // Find user
        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        // Compare password
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "Password is incorrect";
          throw new UserInputError("Password is incorrect", { errors });
        }

        // Generate token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        user.token = token;

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    //// REGISTER
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        // 1. Validate input data
        // 2. Check if username, email exists
        // 3. Hash password
        // 4. Create user
        // 5. Return user

        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Password must match";

        // AVOID EXECUTE 2 QUERIES -> HANDLE ERRORS IN CATCH - UNIQUE ATTRIBUTE
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "Username is taken";
        // if (userByEmail) errors.email = "Email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        password = await bcrypt.hash(password, 10);

        const user = await User.create({
          username,
          email,
          password,
        });

        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          // err.errors.forEach((e) => (errors[e.path] = e.message));
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};
