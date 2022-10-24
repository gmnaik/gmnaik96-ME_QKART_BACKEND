const express = require("express");
const validateSchema = require("../../middlewares/validate");
const registerBodyValidationSchema = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const validateBodyRegisterRequestMiddleware = validateSchema(registerBodyValidationSchema.register);
const validateBodyLoginRequestMiddleware = validateSchema(registerBodyValidationSchema.login);

const router = express.Router();

// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and "/v1/auth/login" routes with request validation

router.post('/register',validateBodyRegisterRequestMiddleware,authController.register);
router.post('/login',validateBodyLoginRequestMiddleware,authController.login);

module.exports = router;
