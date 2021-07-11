const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
    }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    # testing image, may need to be different data type
    image: String
    link: String
  }


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String, authors: [String], description: String, title: String, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;