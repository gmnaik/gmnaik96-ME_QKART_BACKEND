const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const hashPassword = async(password) => {
  //console.log("Inside hashpassword function");
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password,salt);
  return hashedPassword;
}

// const loginUserWithEmailAndPassword = async (email, password) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
//   }
//   return user;
// };

const loginUserWithEmailAndPassword = async (email, password) => 
{
  const user = await userService.getUserByEmail(email);
  
  if(!user)
  {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email is not registered");
  }
  
    const isPasswordValid = await user.isPasswordMatch(password);
    if(!isPasswordValid)
    {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password is wrong");
    }
    return user;
    // if(isPasswordValid)
    // {
    //   console.log("Inside loginUserWithEmailAndPassword if");
    //   return user;
    // }
    // else
    // {
    //   console.log("Inside loginUserWithEmailAndPassword else");
    //   throw new ApiError(httpStatus.UNAUTHORIZED, "Password doesnot match");
    // }
 
};

module.exports = {
  hashPassword,
  loginUserWithEmailAndPassword,
};
