// // @desc    Logs request to console(simpler way to log request to the console)
// const logger = (req, res, next) => {
//   // Log request method, URL, and host to the console
//   console.log(
//     `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
//   );
//   // Move to the next middleware in the stack
//   next();
// };
// // Export the logger middleware function for use in other modules
// module.exports = logger;

// // @desc    Logs request to console(complicated way to log request to the console via winston package library)
// // Import the Winston logging library
// const winston = require("winston");

// // Create a logger instance
// const logger = winston.createLogger({
//   // Configure transports (where logs will be output)
//   transports: [
//     // Log to the console
//     new winston.transports.Console({
//       // Configure log format
//       format: winston.format.combine(
//         // Add colors to log output
//         winston.format.colorize(),
//         // Add timestamp to log messages
//         winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         // Define log message format
//         winston.format.printf(
//           (info) => `${info.timestamp} ${info.level}: ${info.message}`
//         )
//       ),
//     }),
//   ],
// });

// // Middleware function to log requests
// const requestLogger = (req, res, next) => {
//   const start = Date.now(); // Record the start time of the request

//   // Store the reference to the original response.send method
//   const originalSend = res.send;

//   // Override the response.send method to intercept response body size
//   res.send = function (body) {
//     // Log request method, URL, status code, host, time taken by the server to process the request, and response body size
//     logger.info(
//       `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} ${
//         res.statusCode
//       } - ${Date.now() - start}ms - ${body ? body.length : "-"} bytes`
//     );

//     // Call the original response.send method to continue normal flow
//     originalSend.call(this, body);
//   };

//   // Move to the next middleware in the stack
//   next();
// };

// // Error handler middleware
// const errorHandler = (err, req, res, next) => {
//   // Log error stack trace
//   logger.error(err.stack);
//   // Send a 500 Internal Server Error response
//   res.status(500).send("Internal Server Error");
// };

// // Export middleware functions for use in other modules
// module.exports = {
//   requestLogger,
//   errorHandler,
// };
