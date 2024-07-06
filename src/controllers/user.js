const asyncWrapper = require("../middleware/asyncWrapper");
const client = require("../prismaInstance/client");

const getUser = asyncWrapper(async (req, res) => {
    const userId = req.params.id
    await client.organisationUser.find


})

module.exports = { getUser }