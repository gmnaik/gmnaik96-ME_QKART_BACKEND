const Joi = require("joi");
const  {password}  = require("./custom.validation");
// const { joiPasswordExtendCore } = require("joi-password");
// const joiPassword = Joi.extend(joiPasswordExtendCore);
// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
const register = {
  body: Joi.object().keys({
    email: Joi.string().email({tlds:{allow:false}}).required(),
    name: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  })
};

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.string().custom(password).required(),
  })
};

module.exports = {
  register,
  login,
};
