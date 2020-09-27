const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');

// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

// Store the DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    }
  },

  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: 'Adam Scott'
      });
    }
  }
};

const app = express();
db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
