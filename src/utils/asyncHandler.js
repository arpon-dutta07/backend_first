const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err));
  };
};

export { asyncHandler };


// Instead of adding try...catch everywhere,
// we’ll make one helper function called asyncHandler
// that automatically does the same thing for all your routes.

// const asyncHandler = (requestHandler) => { ... }
// asyncHandler is a function.
// It takes another function called requestHandler as input.
// This requestHandler is your route handler — the function that runs when a request comes in.

// return (req, res, next) => { ... }
// This is the function that Express will actually call when someone visits your route.
// Every Express function gets these three things:
// req → the request (what the user sent)
// res → the response (what we send back)
// next → the function that sends control to the next part (for example, error handler)

// The Promise part
// Promise.resolve(requestHandler(req, res, next))
//   .catch((err) => next(err));

// Let’s translate that into simple words:
// “Run the user’s function (requestHandler).
// If it works — great!
// If it fails (throws an error), catch that error and give it to next(err).”
// So it’s automatically adding a try...catch behind the scenes for you!







// The above code and the below code both are same. One is used in a production level, 
// which is highlighted and the other is commented, as this is the easier one.









// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }

// export default asyncHandler;

// This little function helps your backend handle errors safely whenever you use async/await in your routes —
// so your app doesn’t crash if something goes wrong.

// Step 1: const asyncHandler = (fn) => ...
// This means you’re creating a function called asyncHandler.
// It takes another function (named fn) as input.
// That fn is your route handler — the function that runs when a request comes in.

// Step 2: async (req, res, next) => { ... }
// This part returns a new function (a wrapper function).
// This wrapper will be used by Express when a request comes in.
// It receives three things:
// req → the request from client
// res → the response to send back
// next → function to pass control to the next middleware

// Here’s what happens:
// You “try” to run your function (fn), which might contain code like:
// Database queries
// File reads
// API calls
// These are asynchronous operations (they take time).
// That’s why we write await fn(req, res, next).
// If everything goes well ✅,
// it finishes and sends the response successfully.

// Step 4: The catch block
// If something goes wrong ❌ — for example:
// Database is down
// User not found
// Some line of code throws an error
// Then the code “jumps” into this catch block.
// Here, we:
// Send a status code (error.code or 500 if not provided)
// Send a JSON error response back to the client
// So instead of crashing your server,
// it gives the user a clean message like: