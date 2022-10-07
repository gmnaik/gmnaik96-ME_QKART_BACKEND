const express = require("express");
const validateSchema = require("../../middlewares/validate");
const registerBodyValidationSchema = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
//const passport = require("passport");
//require('./config/passport')(passport);

const validateBodyRegisterRequestMiddleware = validateSchema(registerBodyValidationSchema.register);
const validateBodyLoginRequestMiddleware = validateSchema(registerBodyValidationSchema.login);
//const passportmiddleware = passport.authenticate("jwt", {session:false});

const router = express.Router();

// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and "/v1/auth/login" routes with request validation

router.post('/register',validateBodyRegisterRequestMiddleware,authController.register);
router.post('/login',validateBodyLoginRequestMiddleware,authController.login);
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();


module.exports = router;
