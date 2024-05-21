// class ErrorResponse extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;

//     //Error.captureStackTrace(this, this.constructor);
//   }
// }

// module.exports = ErrorResponse;

/**
 * Custom error class for handling HTTP response errors.
 */
class ErrorResponse extends Error {
  /**
   * Constructor for ErrorResponse.
   * @param {string} message - Error message.
   * @param {number} [statusCode=500] - HTTP status code.
   */
  constructor(message, statusCode = 500) {
    super(message); // Call the superclass constructor

    this.statusCode = statusCode; // Set the HTTP status code

    // Capture the stack trace
    //Error.captureStackTrace(this, this.constructor);
  }
}

// Export the ErrorResponse class
module.exports = ErrorResponse;
