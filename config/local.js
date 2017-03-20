"use strict";

// eslint disable no-var

var environmentVariables = require("./environmentVariables"),
  config = {
    "http": {
      "protocol": "http",
      "domain": "127.0.0.1",
      "port": 8020
    },
    "appName": "ch-focus-bridge",
    "mongoDb": {
      "connectionString": environmentVariables.FOCUS_BRIDGE_MONGO_CONNECTION_STRING,
      "operationTimeout": 4000,
      "connectionOptions": {
        "server": {
          "poolSize": 10,
          "socketOptions": {
            "autoReconnect": true,
            "keepAlive": 0
          },
          "reconnectTries": 30,
          "reconnectInterval": 1000
        }
      },
      "promiseTimeout": 4500
    },
    "authorization": {
      "authorize": true
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/app"
  };

module.exports = config;

// eslint enable no-var
