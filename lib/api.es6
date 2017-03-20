"use strict";

import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mwAllowCrossDomain from "./middleware_services/mwAllowCrossDomain";
import mwErrorHandler from "./middleware_services/mwErrorHandler";

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  urlPrefix = config.urlPrefix;

// Sets the relevant config app-wise
app.set("port", config.http.port);
app.set("secretKey", config.secretKey);

app.use(mwAllowCrossDomain);
app.use(bodyParser.json());
// Defines top middleware and routes

app.use(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send("OK");
});

app.use(methodOverride);
app.use(mwErrorHandler);

// Starts the app
app.listen(app.get("port"), function () {
  console.log(`Server has started at ${new Date()} and is listening on port: ${app.get("port")}`);
});
