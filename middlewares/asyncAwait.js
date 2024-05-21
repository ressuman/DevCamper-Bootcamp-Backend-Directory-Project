// asyncAwaitHandler is a higher-order function that takes a function 'fn' as an argument
const asyncAwaitHandler = (fn) => (req, res, next) =>
  // Promise.resolve is used to handle asynchronous operations in 'fn'
  // fn(req, res, next) executes the provided function with the request, response, and next middleware in the chain
  Promise.resolve(fn(req, res, next))
    // .catch(next) catches any errors that occur during the execution of 'fn' and passes them to the error handling middleware 'next'
    .catch(next);

// Export the asyncAwaitHandler function to be used as middleware in Express routes
module.exports = asyncAwaitHandler;
