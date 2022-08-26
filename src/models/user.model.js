const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
// userSchema.statics.isEmailTaken = async function (email) {
//   const isemailpresent = await User.find({email:email});
//   if(isemailpresent) 
//   {
//     return true;
//   }
//   else
//   {
//     return false;
//   }
// }


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: (isvalidEmail) => validator.isEmail(isvalidEmail),
      //statics: (isEmailtaken) => this.isEmailTaken(isEmailtaken),
      // statics: {async isEmailTaken(email){
      //   const isemailpresent = await User.find({email:email});
      //   if(isemailpresent) 
      //   {
      //     return true;
      //   }
      //   else
      //   {
      //     return false;
      //   }
      // }}
      //statics: isEmailTaken(email),
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: 500,
    },
    address: {
      type: String,
      required: false,
      trim: false,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const isemailpresent = await this.find({email:email});
  if(isemailpresent) 
  {
    return true;
  }
  else
  {
    return false;
  }
}


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */

 const User = mongoose.model("users",userSchema);

 module.exports.User = User;
