const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/mongoDB/user');
const _ = require('lodash');
const { noRoleError } = require('./../errors/error');

const authenticateUser_C = user => {
  return User.find({ _id: user.id }, { roles: 1 }); // do not feed password back to query, password stays in database
};
const checkUserExists_C = input => {
  return User.find({ email: input.email }, { name:1, email: 1, roles: 1 });
};

const loginUser_C = input => {
  // return User.find({ email: input.email, password: input.password }, { id: 1, name: 1, email: 1, roles: 1 },
  return User.find({ email: input.email, password: input.password }).then((res) => {
    //after successfull login, return JWT token
    // do not feed password back to query, password stays in database
    res[0].password = jwt.sign(
                  { id: res[0].id, email: res[0].email, name:res[0].name },
                    process.env.JWT_SECRET,
                  { expiresIn: '3d' }
                  );
    return res;
  }
  );
}

const addUser_C = input => {
  input.roles = ["dummy"]; // assign a dummy roles at first time user is created
  let user = new User(input);
  return user.save();
}

const updateUser_C = input => {
  // don't let user update his own role, only admin can update roles
  User.findByIdAndUpdate(input.id, input, function (err, result) {
    if (err) {
      console.log(err);
    }
    return input;
  });
};

const updateUserAdmin_C = input => {
  // don't let user update his own role, only admin can update roles
  User.findOne({ _id: input.myid }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (_.intersectionWith(docs.roles, input.expectedRoles, _.isEqual).length >= 1) {
        User.findByIdAndUpdate(input.id, input, function (err, result) {
          if (err) {
            console.log(err);
          }
          return true;
        });

      } else {
        //throw new noRoleError();
      }
    }
  });
};

module.exports = {
  authenticateUser_C,
  checkUserExists_C,
  loginUser_C,
  addUser_C,
  updateUser_C,
  updateUserAdmin_C
};
