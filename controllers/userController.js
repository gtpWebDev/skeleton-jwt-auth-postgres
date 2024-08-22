const passport = require("passport");
const User = require("../models/userModel");

const { body, validationResult } = require("express-validator");

const authMiddleware = require("../lib/authMiddleware");

const passwordUtils = require("../lib/passwordUtils");

// short form, applying try {} catch(err)
const asyncHandler = require("express-async-handler");

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  // render the "index" view, with the given parameters
  res.render("index", { title: "Home Page" });
});

// display register page
exports.register_get = asyncHandler(async (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="/user/register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// user attempts to register
exports.register_post = [
  // Validate and sanitize received inputs (username and password).
  body("username", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be a minimum of 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log("errors array", errors.array());

    if (!errors.isEmpty()) {
      // There are errors. Send a message that registration has failed.

      // construct helpful error message
      let errorMsg = "";
      errors.array().forEach((element) => {
        errorMsg += element.msg + " ";
      });
      errorMsg = errorMsg.slice(0, -1);

      res.status(400).json({ success: false, msg: errorMsg });
    } else {
      // Data from form is valid.

      // apply the local strategy to generate a salt and password hash from the password
      const saltAndHash = passwordUtils.generatePassword(req.body.password);
      const salt = saltAndHash.salt;
      const passwordHash = saltAndHash.passwordHash;

      const newUser = new User({
        username: req.body.username,
        hash: passwordHash,
        salt: salt,
        admin: false,
      });

      // add the new user to the database
      newUser.save().then((user) => {
        // issue a JWT and return it
        const jwt = passwordUtils.issueJWT(user);

        // console.log("token", jwt.token);

        res.status(200).json({
          success: true,
          user: user,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
      });
    }
  }),
];

// user requests login page
// exports.login_get = asyncHandler(async (req, res, next) => {
//   const form =
//     '<h1>Login Page</h1><form method="POST" action="/user/login">\
//   Enter Username:<br><input type="text" name="username">\
//   <br>Enter Password:<br><input type="password" name="password">\
//   <br><br><input type="submit" value="Submit"></form>';
//   res.send(form);
// });

// user attempts to login
exports.login_post = asyncHandler(
  // if failureRedirect and successRedirect are used above, this next middleware function would not be called
  async (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ success: false, msg: "Unauthorised: could not find user" });
        }

        // Function defined at bottom of app.js
        const isValid = passwordUtils.validatePassword(
          req.body.password,
          user.hash,
          user.salt
        );

        if (isValid) {
          const jwt = passwordUtils.issueJWT(user);
          res.status(200).json({
            success: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expires,
          });
        } else {
          res
            .status(401)
            .json({ success: false, msg: "Unauthorised: incorrect password" });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

// request for dashboard page
exports.dashboard_get = [
  // passport middleware applies verifyCallback
  passport.authenticate("jwt", { session: false }),
  // emits user in response
  asyncHandler(async (req, res, next) => {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ success: false, msg: "Unauthorised: could not find user" });
        }
        res.status(200).json({ success: true, data: user });
      })
      .catch((err) => {
        next(err);
      });
  }),
];

// exports.protected_get = [
//   // passport middleware applies verifyCallback
//   passport.authenticate("jwt", { session: false }),
//   asyncHandler((req, res, next) => {
//     res.status(200).json({
//       success: true,
//       msg: "You are successfully authorized to this route!",
//     });
//   }),
// ];

// exports.admin_get = [
//   // passport middleware applies verifyCallback
//   passport.authenticate("jwt", { session: false }),
//   authMiddleware.isAdmin,
//   asyncHandler((req, res, next) => {
//     res.status(200).json({
//       success: true,
//       msg: "You are successfully authorized to this admin route!",
//     });
//   }),
// ];

// Logout is meaningless in the context of JWT as the session authorization and expiry is held with the client
// However, it may be helpful to have a process for blacklisting a token.
// exports.logout_get = asyncHandler(async (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/user/login");
//   });
// });
