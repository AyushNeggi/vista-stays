// Custom error class for handling Express errors
class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode; // Sets the HTTP status code
        this.message = message; // Custom error message
    }
}
module.exports = ExpressError;