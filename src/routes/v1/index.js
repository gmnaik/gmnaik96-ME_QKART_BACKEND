const express = require("express");
const app = require("../../app");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const router = express.Router();

console.log("Inside routes/v1/index.js");
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Reroute all API requests beginning with the `/v1/users` route to Express router in user.route.js

router.use("/auth",authRoute);
router.use("/users",userRoute);
router.use("/products",productRoute);

module.exports = router;
