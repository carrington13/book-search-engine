const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: Image
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
    image: Image
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
    saveBook(input: BookInput): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;