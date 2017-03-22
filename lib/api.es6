"use strict";

import express from "express";
import bodyParser from "body-parser";
import mwAllowCrossDomain from "./middleware_services/mwAllowCrossDomain";
import mwErrorHandler from "./middleware_services/mwErrorHandler";
import passport from "passport";
import {Strategy} from "passport-facebook";
import session from "express-session";
import cookieParser from "cookie-parser";
import socketio from "socket.io";
import http from "http";
import path from "path";
import authRouter from "./endpoints";
import checkEnvironmentVariables from "./util/checkEnvironmentVariables";
import {MongoDbService} from "./mongodb/MongoDbService";

require("babel-polyfill");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  server = http.createServer(app),
  io = socketio.listen(server),
  urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables");

io.sockets.on("connection", socket => {
  console.log("User Connected ... ");

  socket.on("disconnect", () => {
    console.log("User Disconnected ... ");
  });

  socket.on("chat message", msg => {
    console.log("Message: " + msg);
    io.sockets.emit("new message", msg);
  });

});

// Checks the required enviro// Defines top middleware and routesnment variables
// Logs the missing environment variables and exit the application
if (config.environmentVariableChecker.isEnabled) {
  checkEnvironmentVariables(environmentVariables);
}

// Sets the relevant config app-wise
app.set("port", config.http.port);

app.use(mwAllowCrossDomain);
// Defines top middleware and routes

app.use(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send("OK");
});

// Passport session setup.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new Strategy(
  {
    "clientID": config.facebook.clientID,
    "clientSecret": config.facebook.clientSecret,
    "callbackURL": config.facebook.callbackURL
  }, (accessToken, refreshToken, profile, cb) => {
    // Saving profile information to MongoDB
    let mongoInstance = new MongoDbService({"config": config}),
      userInfo = Object.assign(profile, {"accessToken": accessToken, "refreshToken": refreshToken});

    mongoInstance.save({"collection": "users", "document": userInfo})
      .then(dbResult => {
        console.log("User Info successfully updated --> ", dbResult.result);
        return cb(null, profile);
      });
  }));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({"extended": false}));
app.use(session({
  "secret": "035e907df0e4014a6374c744d470dab3",
  "resave": false,
  "saveUninitialized": true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  console.log("User Info ---> ", req.user);
  res.render("index", {"user": req.user});
});

app.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", {"user": req.user});
});

app.use("/auth", authRouter);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.use(mwErrorHandler);

// Starts the app
server.listen(app.get("port"), () => {
  console.log(`Server has started at ${new Date()} and is listening on port: ${app.get("port")}`);
});
