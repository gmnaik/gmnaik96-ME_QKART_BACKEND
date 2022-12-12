const httpStatus = require("http-status");
const { User, Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
    const userCart = await Cart.findOne({email : user.email});
    //console.log("User cart in getCartByUser:",userCart);
    if(!userCart)
    {
      throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart");
    }
    return userCart;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  let createCart = {};
  let newCart = {};
  let productObj = {};
  
  const productInDatabase = await Product.findById(productId);

  if(!productInDatabase)
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"Product doesn't exist in database");
  }

  const isUserCartPresent = await Cart.findOne({email : user.email});

  if(!isUserCartPresent)
  {
    createCart = {
      "email" : user.email,
      "cartItems" : [
      ],
      "paymentOption": config.default_payment_option
    }
    newCart = await Cart.create(createCart);

    if(!newCart)
    {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"Internal Server Error");
    }

    productObj = {
      product :
      {
        _id: productInDatabase._id,
        name: productInDatabase.name,
        category: productInDatabase.category,
        rating: productInDatabase.rating,
        cost: productInDatabase.cost,
        image: productInDatabase.image,
      },
      quantity: quantity
    }

    newCart.cartItems.push(productObj);
    newCart.save();
    return newCart;
  }

  else
  {
    if (isUserCartPresent.cartItems.some((item) => item.product._id == productId))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product already in cart. Use the cart sidebar to update or remove product from cart"
    );
    productObj = {
      product :
      {
        _id: productInDatabase._id,
        name: productInDatabase.name,
        category: productInDatabase.category,
        rating: productInDatabase.rating,
        cost: productInDatabase.cost,
        image: productInDatabase.image,
      },
      quantity: quantity
    }
    //console.log("Product obj:",productObj);
      
    isUserCartPresent.cartItems.push(productObj);
    isUserCartPresent.save();
    return isUserCartPresent;
  }

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {

  const isUserCartPresent = await Cart.findOne({email : user.email});

  if(!isUserCartPresent)
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart. Use POST to create cart and add a product");
  }

  const productInDatabase = await Product.findById(productId);
  if(!productInDatabase)
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"Product doesn't exist in database");
  }

  if (isUserCartPresent.cartItems.some((item) => item.product._id == productId))
  {
    const updateProductObj = isUserCartPresent.cartItems;
    for(let i=0;i<updateProductObj.length;i++)
    {
      if(updateProductObj[i].product._id == productId)
      {
        updateProductObj[i].quantity = quantity;
        isUserCartPresent.save();
      }
      else
      {
        continue;
      }
    }
  }
  else
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart.");
  }

  return isUserCartPresent;

};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const isUserCartPresent = await Cart.findOne({email : user.email});

  if(!isUserCartPresent)
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart");
  }

  if (isUserCartPresent.cartItems.some((item) => item.product._id == productId))
  {
    const deleteProductObj = isUserCartPresent.cartItems;
    for(let i=0;i<deleteProductObj.length;i++)
    {
      if(deleteProductObj[i].product._id == productId)
      {
        isUserCartPresent.cartItems.pop(deleteProductObj[i]);
        isUserCartPresent.save();
      }
      else
      {
        continue;
      }
    }
  }
  else
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart.");
  }
  return isUserCartPresent;
};



// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  //console.log("In checkout function:",user);
  
  // //const userPresent = await User.findOne({email: user.email});
  // const userCartPresent = await Cart.findOne({email: user.email});
  
  // //console.log("User is present",userPresent);

  // const addressIsSet = await user.hasSetNonDefaultAddress();
  // //console.log("User.hasSetNonDefaultAddress",addressIsSet);

  // if(!addressIsSet)
  // {
  //   throw new ApiError(httpStatus.BAD_REQUEST,'User need to add address');
  // }

  // if(!userCartPresent)
  // {
  //   throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart");
  // }

  // let cartProductList = userCartPresent.cartItems;
  // //console.log("Products in cart count",cartProductList.length);
  // if (cartProductList.length == 0)
  // {
  //   throw new ApiError(httpStatus.BAD_REQUEST,"Cart is empty.Plz add products to checkout");
  // }
  // else
  // {
  //   let cartTotal = 0;
  //   let remainingBalanceAfterCheckOut;
  //   for(let i=0;i<cartProductList.length;i++)
  //   {
  //     //console.log("Checkout func:",cartProductList[i]);
  //     cartTotal = cartTotal + (cartProductList[i].product.cost * cartProductList[i].quantity);
  //     //console.log("Cart total:",cartTotal);
  //   }
  //   //console.log("Wallet money",user.walletMoney);

  //   if(cartTotal > user.walletMoney)
  //   {
  //     throw new ApiError(httpStatus.BAD_REQUEST,"Wallet balance is insufficient.Plz add money in wallet");
  //   }
  //   else
  //   {
  //     remainingBalanceAfterCheckOut = user.walletMoney - cartTotal;
  //     user.walletMoney = remainingBalanceAfterCheckOut;
  //     await user.save();
  //     cartProductList.splice(0,cartProductList.length);
  //     await userCartPresent.save();
  //   }
  // }
  // //console.log("User:",user);
  // //console.log("User Cart:",userCartPresent);
  
  // return userCartPresent;



  let cart = await Cart.findOne({ email: user.email });
  if (cart == null) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }

  // TODO - Test2
  if (cart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }
  
  // TODO - Test3
  let hasSetNonDefaultAddress = await user.hasSetNonDefaultAddress();
  if (!hasSetNonDefaultAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  }
  // if (user.address == config.default_address) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  // }

  // TODO - Test4
  let total = 0;
  for (let i = 0; i < cart.cartItems.length; i++) {
    total += cart.cartItems[i].product.cost * cart.cartItems[i].quantity;
  }

  if (total > user.walletMoney) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User has insufficient money to process"
    );
  }

  // TODO - Test 5
  user.walletMoney -= total;
  await user.save();

  cart.cartItems = [];
  await cart.save();




};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
