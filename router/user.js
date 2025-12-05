express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrAapAsync = require("../utils/wrAapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

//signup
router.route("/signup")
    .get( userController.signupForm)
    .post( wrAapAsync(userController.signup));
//login
router.route("/login")
    .get( userController.loginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect: '/login',
    failureFlash:true}),
    userController.login);
//logout
router.get("/logout",userController.logout );

module.exports = router;
