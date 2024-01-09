var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/profile", isLogedIn, function (req, res, next) {
  res.send("profile");
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  userData.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "profile",
    failureRedirect: "/",
  }),
  function () {}
);

router.post("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
module.exports = router;
