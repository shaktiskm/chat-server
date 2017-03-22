"use strict";

// eslint disable no-var

var environmentVariables = require("./environmentVariables"),
  config = {
    "http": {
      "protocol": "http",
      "domain": "127.0.0.1",
      "port": 3000
    },
    "facebook": {
      "clientID": environmentVariables.FACEBOOK_CLIENT_ID,
      "clientSecret": environmentVariables.FACEBOOK_CLIENT_SECRETKEY,
      "callbackURL": environmentVariables.FACEBOOK_CALLBACK_URL
    },
    "mongoDb": {
      "connectionString": environmentVariables.MONGO_CONNECTION_STRING,
      "operationTimeout": 4000,
      "connectionOptions": {
        "server": {
          "poolSize": 5,
          "socketOptions": {
            "autoReconnect": true,
            "keepAlive": 0
          },
          "reconnectTries": 30,
          "reconnectInterval": 1000
        }
      }
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
