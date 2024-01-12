var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});
router.post(
  "/upload",
  isLogedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).send("no files were given");
    }
    // jo post upload huwa hai ushe save karo and post ka postId user ko do and user ka userId post ko do
    const user = await userModel.findOne({
      username: req.session.passport.user,
    }); // current user find kiya gaya hai
    const post = await postModel.create({
      image: req.file.filename, // images ka url link req.file.filename me hota hai
      imageText: req.body.fileCaption,
      user: user,
    });

    user.posts.push(post._id);
    await user.save();
    res.send("done");
  }
);

router.get("/profile", isLogedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.post("/register", function (req, res) {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "profile",
    failureRedirect: "/login",
    failureFlash: true,
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
  res.redirect("/login");
}
module.exports = router;
