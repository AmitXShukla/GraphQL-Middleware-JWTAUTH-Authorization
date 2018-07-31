const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/mongoDB/user');
const _ = require('lodash');
const { noRoleError } = require('./../errors/error');

const getUser_C = user => {
  //return User.find({ _id: user.id }, { roles: 1 }); // do not feed password back to query, password stays in database
  return User.find({ _id: user.id }).then((res)=> {
    if(res.length > 0) {
      return { name:res[0].name, email: res[0].email }
    } else {
      return { name:"", email:"" };
    }
  });
};
const checkUserExists_C = input => {
  return User.find({ email: input.email }, { name:1, email: 1, roles: 1 });
};

const loginUser_C = input => {
  return User.find({ email: input.email, password: input.password }).then((res) => {
    //after successfull login, return JWT token
    // do not feed password back to query, password stays in database
    if(res.length > 0) {
    pswd = jwt.sign(
                  { id: res[0].id, email: res[0].email, name:res[0].name },
                    process.env.JWT_SECRET,
                  { expiresIn: '3d' }
                  );
    return {token: pswd};
  } else {
    return {token: ""};
  }
}
  );
}

const addUser_C = input => {
  input.roles = ["dummy"]; // assign a dummy roles at first time user is created
  let user = new User(input);
  return User.find({ email: input.email }).then((res) => {
    if(res.length > 0) {
      return {name:"",email:"", password: ""};
    } else {
      user.save();
      return input
    }
  });
}

const updateUser_C = input => {
  // don't let user update his own role, only admin can update roles
  return User.findByIdAndUpdate(input.id, input, function (err, res) {
    if (err) {
      console.log(err);
    }
    if(res) {
      return {name:res.name,email:res.email};
    } else {
      return {name:"",email:""};
    }
  });
};

const updateUserAdmin_C = input => {
  // don't let user update his own role, only admin can update roles
  return User.findOne({ _id: input.myid }, function (err, docs) {
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
  getUser_C,
  checkUserExists_C,
  loginUser_C,
  addUser_C,
  updateUser_C,
  updateUserAdmin_C
};
