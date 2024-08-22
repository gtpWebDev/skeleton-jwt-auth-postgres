var express = require("express");
const router = express.Router();

// this acts as a conduit for all the routes to reduce routes in app.js to one line

const userRouter = require("./userRoutes");

router.use("/user", userRouter);

/* GET home page. */
router.get("/", function (req, res, next) {
  // render the "index" view, with the given parameters
  res.render("index", { title: "Account Home Page" });
});

module.exports = router;
