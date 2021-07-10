const express = require('express');
// import ApolloServer
const {ApolloServer} = 'apollo-server-express'
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes');
// import schemas and auth
const { typeDefs, resolvers} = require('./schemas');
const { authMiddleware } = require('./auth')

const app = express();
const PORT = process.env.PORT || 3001;
// set ApolloServer and pass in schemas and authMiddleWare
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

server.applyMiddleware({ app });

// TODO? turn to false later
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`) 
  });
});

