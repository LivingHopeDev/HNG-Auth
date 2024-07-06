const customError = (message, statusCode = 400, status = "Bad request") => {
    return {
        status,
        message,
        statusCode,
    };
};





module.exports = customError;
