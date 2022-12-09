const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
//const User = require("../models/user.model");

/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */

 const getUserById = async(userId) => {
    //const {id} = req.params;
    //console.log("In getUserById service function");
    const user = await User.findOne({_id : userId});
    return user;
 }

 const getAllUsers = async() => {
    //const {id} = req.params;
    //console.log("In getAllUsers service function");
    const allusers = await User.find({});
    //console.log("In getAllUsers service function:",allusers);
    return allusers;
 }

 
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */

 const getUserByEmail = async(email) => {
    //const {id} = req.params;
    //console.log("In getUserById service function");
    const user = await User.findOne({email : email});
    return user;
 }

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)

/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */

 const createUser = async(userBody) => {
    if(User.isEmailTaken() === true)
    {
        throw new ApiError(httpStatus[200],'Email already taken');
    }
    else
    {
        try{
            let user = {
                //_id : userBody._id,
                walletMoney : userBody.walletMoney,
                address: userBody.address,
                name: userBody.name,
                email: userBody.email,
                password: userBody.hashedpassword,   
            };
            const newUser = await User.create(user);
            //const result = newUser.save();
            //console.log("New User from createUser:",newUser);
            return newUser;
        }
        catch(err){
            console.log("Create user error:",err);
        }
    }
 
 }

// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id) => {
    const user = await User.findOne({"_id" : id},{"address":1,"email":1});
    
    return user;
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
const setAddress = async (user, newAddress) => {
  //console.log("Old user address:",user);
  user.address = newAddress;
  await user.save();
  //console.log("New user address:",user)

  return user.address;
};

module.exports = {
    getUserById,
    getAllUsers,
    getUserByEmail,
    createUser,
    getUserAddressById,
    setAddress
};

