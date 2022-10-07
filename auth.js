const jwt = require("jsonwebtoken");

// authenticate endpoint
module.exports = async (request, response, next) => {
  try {
    // request authentication token from authorization header
    const token = await request.headers.authorization.split(' ')[1];
    // verify token
    const decodedToken = await jwt.verify(
      token,
      "RANDOM-TOKEN"
      );
    // extract user id from token
    const user = await decodedToken;
    // pass user id to request
    request.user = user;
    // pass requested functionality to the endpoint
    next();
    // on token reject response
  } catch (error) {
    response.status(401).json({
      error: new Error('Invalid request!'),
    });
  };  
};