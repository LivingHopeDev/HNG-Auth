const validateUser = async (body, type) => {
    const errors = [];
    const requiredFields = type === "register"
        ? ["firstName", "lastName", "email", "password"]
        : type === "login"
            ? ["email", "password"]
            : ["name"];
    requiredFields.forEach((field) => {
        if (!body[field]) {
            errors.push({ field, message: `${field} is required` });
        }
    });

    if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.errors = errors;
        throw error;
    }
};

module.exports = { validateUser }