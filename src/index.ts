var { ruruHTML } = require('ruru/server');
var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');

var Memcached = require('memcached');

var memcached = new Memcached('localhost:11211', {
  retries: 10,
  retry: 10000,
  remove: true,
  failOverServers: ['192.168.0.103:11211'],
});

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello() {
    return 'Hello world!';
  },
};

var app = express();

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  //If you navigate to http://localhost:4000,
  // you should see an interface that lets you enter queries;
  // now you can use the GraphiQL IDE tool to issue GraphQL
  // queries directly in the browser.

  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
