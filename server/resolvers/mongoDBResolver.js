const jwt = require('jsonwebtoken');
const { AuthorizationError, noInputError } = require('./../errors/error');

function checkToken(context) {
  const token = context.headers.token;
  if (!token) {
    throw new AuthorizationError({
      message: `You must supply a JWT for authorization!`
    });
  }
  const decoded = jwt.verify(
    token.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );
  return decoded;
}

const getUser_R = (context, connectorQuery) => {
  return connectorQuery.apply(this, [checkToken(context)]);
};

const checkUserExists_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `You must supply a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const loginUser_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `You must supply a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const addUser_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `You must supply a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const updateUser_R = (context,input,connectorQuery) => {
  input["id"] = checkToken(context).id;
  return connectorQuery.apply(this, [input]);
};

const updateUserAdmin_R = (context, input, expectedRoles, connectorQuery) => {
  input["myid"] = checkToken(context).id;
  input["expectedRoles"] = expectedRoles;
  return connectorQuery.apply(this, [input]);
}

const addNewUser_R = (context, input, connectorQuery) => {
  console.log(input);
};

module.exports = { 
  getUser_R,
  checkUserExists_R,
  loginUser_R,
  addUser_R,
  updateUser_R,
  updateUserAdmin_R
};