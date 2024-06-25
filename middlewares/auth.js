const jwt = require("jsonwebtoken");
const asyncAwaitHandler = require("./asyncAwait");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes: Middleware to ensure authentication before accessing protected routes
exports.protect = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Initialize a variable to store the token
    let token;

    // Retrieve the authorization header from the request
    const authHeader = req.headers.authorization;
    // Check if the authorization header exists and starts with "Bearer"
    const isBearerToken = authHeader?.startsWith("Bearer");

    // Retrieve the token from cookies
    const cookieToken = req.cookies.token;

    // Ensure both tokens are present
    if (!isBearerToken) {
      throw new ErrorResponse(
        "Not authorized to access this route-Bearer",
        401
      );
    }
    if (!cookieToken) {
      throw new ErrorResponse(
        "Not authorized to access this route-Cookie",
        401
      );
    }

    // Extract the token from the authorization header by splitting the string and taking the second part
    token = authHeader.split(" ")[1];

    // Check if the token from the authorization header does not match the token from the cookies
    if (token !== cookieToken) {
      // Throw an error indicating a token mismatch
      throw new ErrorResponse("Token mismatch", 401);
    }

    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer")
    // ) {
    //   // Set token from Bearer token in header
    //   token = req.headers.authorization.split(" ")[1];
    //   // Set token from cookie
    // } else if (req.cookies.token) {
    //token = req.cookies.token;
    //}

    // Make sure token exists
    // if (!token) {
    //   return next(
    //     new ErrorResponse("Not authorized to access this route", 401)
    //   );
    // }

    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user based on the decoded token's id
      req.user = await User.findById(decoded.id);

      // Check if the user exists
      if (!req.user) {
        throw new ErrorResponse("No user found with this id", 404);
      }

      // Proceed to the next middleware
      next();
    } catch (err) {
      // If token verification fails, send a 401 Unauthorized error
      throw new ErrorResponse("Not authorized to access this route", 401);
    }
  } catch (err) {
    // If an error occurs, pass it to the error handling middleware
    next(err);
  }
});

/**
 * Middleware to authorize user roles for accessing specific routes
 * @param {...string} roles - The roles allowed to access the route
 * @returns {function} Middleware function for role-based authorization
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Ensure req.user and req.user.role exist to prevent runtime errors
      if (!req.user?.role) {
        return next(
          new ErrorResponse("User role information not available", 403)
        );
      }

      // Check if user's role is included in the provided roles
      if (!roles.includes(req.user.role)) {
        // If user's role is not authorized, send a 403 Forbidden error
        return next(
          new ErrorResponse(
            `User role as a ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }

      // If authorized, proceed to the next middleware
      next();
    } catch (err) {
      // Catch any unexpected errors and pass to error handling middleware
      next(new ErrorResponse("Authorization failed", 500));
    }
  };
};
