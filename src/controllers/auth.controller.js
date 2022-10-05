const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
const { User } = require("../models");
/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */

  const register = async (req, res) => {
    try
      {
        const {walletMoney,address,name,email,password} = req.body;
        const hashedPassword = await authService.hashPassword(password);
        
        let userBody = {
          walletMoney : walletMoney,
          address: address,
          name: name,
          email: email,
          hashedpassword: hashedPassword,   
        };
        
        const ifuserfoundbyemail = await userService.getUserByEmail(userBody.email);
        if(ifuserfoundbyemail)
        {
          res.status(200).json({error:"Email already taken"});
        }
        else
        {
          const newuserregister = await userService.createUser(userBody);
          if(newuserregister)
          {
            const authtokens = await tokenService.generateAuthTokens(newuserregister._id);
            res.status(201).json({user : newuserregister, tokens : authtokens});
          }
          else
          {
            res.status(401).json({error: "Unable to register user"});
          }
        }  
      }
      catch(err){
        console.log("Error in registering user:",err);
      }
  };

/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync (async (req, res) => 
{
    const {email,password} = req.body;
    // console.log("Inside login controller");
    const result = await authService.loginUserWithEmailAndPassword(email,password);
    if(result)
    {
      console.log("Inside login if");
      const generateauthtokens = await tokenService.generateAuthTokens(result);
      res.status(200).json({user:result, tokens: generateauthtokens});
    }
    // else
    // {
    //   console.log("Inside login else");
    //   res.status(401).json({"code":401, "message":"Unable to login"});
    // }
}
);


module.exports = {
  register,
  login,
};
