// Import the required libraries
var Sequelize = require('sequelize');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var app = express();

// Connect to DB
var sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  null,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

// Check DB connection
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

// Define the User type with two string fields: `id` and `name`.
// The type of User is GraphQLObjectType, which has child fields
// with their own types (in this case, GraphQLString).
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});

// Define the schema with one top-level field, `user`, that
// takes an `id` argument and returns the User with that ID.
// Note that the `query` is a GraphQLObjectType, just like User.
// The `user` field, however, is a userType, which we defined above.
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args` describes the arguments that the `user` query accepts
        args: {
          id: { type: graphql.GraphQLString }
        },
        // The resolve function describes how to "resolve" or fulfill
        // the incoming query.
        // In this case we use the `id` argument from above as a key
        // to get the User from `data`
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

var port = '3000'
app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true }));
var server = app.listen(port, function () {
  var ip = require('os').networkInterfaces().eth0[0].address;
  console.log('GraphQL server running on http://'+ip+':'+port+'/graphql');
});

// Print Users from DB
sequelize.query('SELECT * FROM "Users"', {raw: true}).then(function(myTableRows) {
  console.log(myTableRows)
});
