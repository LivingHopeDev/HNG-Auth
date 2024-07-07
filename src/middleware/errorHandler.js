const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };

    if (err instanceof Error && Array.isArray(err.errors)) {
        return res.status(customError.statusCode).json({ errors: err.errors });
    }


    return res.status(customError.statusCode).json(err);
};

module.exports = errorHandlerMiddleware;
