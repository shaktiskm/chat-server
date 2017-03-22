"use strict";

import express from "express";
import passport from "passport";

let router = express.Router(),
  loginRoute = router.route("/login"),
  facebookRoute = router.route("/facebook"),
  facebookResponseRoute = router.route("/facebook/callback");

loginRoute
  .get((req, res) => {
    res.send("login");
  });

facebookRoute
  .get(passport.authenticate("facebook", {"scope": "email"}));

facebookResponseRoute
  .get(passport.authenticate("facebook", {
    "successRedirect": "/",
    "failureRedirect": "/auth/login"
  }), (req, res) => {
    console.log("Authentication successful----");
    res.redirect("/");
  });

export default router;
