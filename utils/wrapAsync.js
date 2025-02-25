// Middleware function to catch async errors and pass them to next()
module.exports = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next); // Catches any errors and forwards them to Express error handler
    };
};