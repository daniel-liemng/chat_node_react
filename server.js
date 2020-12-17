const { ApolloServer } = require("apollo-server");
const { sequelize } = require("./models");
const dotenv = require("dotenv");

dotenv.config();

// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => ctx,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  // DB Connect
  sequelize
    .authenticate()
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("Error", err));
});
