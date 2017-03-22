"use strict";

// eslint disable no-var

var environmentVariables = {
  "MONGO_CONNECTION_STRING": process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/zimplistic",
  "FACEBOOK_CLIENT_ID": process.env.FACEBOOK_CLIENT_ID || "1453011668076428",
  "FACEBOOK_CLIENT_SECRETKEY": process.env.FACEBOOK_CLIENT_SECRETKEY || "cd188c798bd5a841ab68dabbae0e80cb",
  "FACEBOOK_CALLBACK_URL": process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/auth/facebook/callback"
};

module.exports = environmentVariables;

// eslint enable no-var
