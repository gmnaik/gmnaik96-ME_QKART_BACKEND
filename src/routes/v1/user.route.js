const express = require("express");
//const app = express();
const cors = require('cors');
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");


//const app = require("../../app");
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
// app.use(cors());

//const passport = require("passport");
// app.use(passport.initialize());
// require("../../config/passport");

const auth = require("../../middlewares/auth");
const router = express.Router();

//const passportmiddleware = passport.authenticate('jwt', {session:false});

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`

router.get("/allusers",userController.getallusers);
router.get("/:userId",auth,validate(userValidation.getUser) ,userController.getUser);

module.exports = router;


