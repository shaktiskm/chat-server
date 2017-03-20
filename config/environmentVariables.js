"use strict";

// eslint disable no-var

var environmentVariables = {
  "FOCUS_BRIDGE_MONGO_CONNECTION_STRING": process.env.FOCUS_BRIDGE_MONGO_CONNECTION_STRING || "mongodb://10.18.6.110:27017/practice_details",
  "FOCUS_BRIDGE_LOGGING_LEVEL": process.env.FOCUS_BRIDGE_LOGGING_LEVEL || "debug",
  "FOCUS_BRIDGE_SECRET_KEY": process.env.FOCUS_BRIDGE_SECRET_KEY || "45a3c06e-ab7e-4256-9e9c-da2ac168ef25"
};

module.exports = environmentVariables;

// eslint enable no-var
