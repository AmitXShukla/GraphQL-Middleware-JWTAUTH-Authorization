const { makeExecutableSchema } = require('graphql-tools');
const { // define resolvers
  authenticateUser_R,
  checkUserExists_R,
  loginUser_R,
  addUser_R,
  updateUser_R,
  updateUserAdmin_R
} = require('.././resolvers/mongoDBResolver');
const { // define mongodb connectors
  authenticateUser_C,
  checkUserExists_C,
  loginUser_C,
  addUser_C,
  updateUser_C,
  updateUserAdmin_C
} = require('../connectors/mongoDB');

// passwrd field on type User shouldn't expose passwords
// instead is used to store json token after successfull login query - loginUser_Q
// it's ok to leave password at UserInput at Mutation
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    roles: [String]!
  }
  type UserExists {
    name: String!
    email: String!
    roles: [String]!
  }
  type LoginUser {
    password: String!
  }
  type Token {
    token: String!
  }
  type Query {
    authenticateUser_Q: [User]
    checkUserExists_Q(email:String!): [UserExists]
    loginUser_Q(email:String!,password:String!): [LoginUser]
  }
  type Mutation {
    addUser_M(name:String!,email:String!,password:String!): User
    updateUser_M(name:String!,email:String!,password:String!): User
    updateUserAdmin_M(id:String!,roles:[String!]!): User
  }
`;

const resolvers = {
  Query: {
    authenticateUser_Q: (_, args, context) => authenticateUser_R(context, authenticateUser_C),
    checkUserExists_Q: (_, args, context) => checkUserExists_R(args, checkUserExists_C), //check if user email already exists, for new user id creation
    loginUser_Q: (_, args, context) => loginUser_R(args, loginUser_C)
  },
  Mutation: {
    addUser_M: (_, args, context) => addUser_R(args,addUser_C), // first time user is created see - connector where a dummy role is inserted
    updateUser_M: (_, args, context) => updateUser_R(context,args,updateUser_C), //check jwt token, validate if user is self then update own email & password but NOT the roles
    updateUserAdmin_M: (_, args, context) => updateUserAdmin_R(context,args,["admin","owner"],updateUserAdmin_C) //check jwt token, validate if user is admin then update any other user's roles
  }
};

module.exports = new makeExecutableSchema({ typeDefs, resolvers });