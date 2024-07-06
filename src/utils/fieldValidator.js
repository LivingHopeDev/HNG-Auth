const validateUser = async (body, next) => {
    const errors = [];

    const requiredFields = ["firstName", "lastName", "email", "password"];
    requiredFields.forEach((field) => {
        if (!body[field]) {
            errors.push({ field, message: `${field} is required` });
        }


    })
    if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.errors = errors;
        throw error;
    }

};


module.exports = { validateUser }