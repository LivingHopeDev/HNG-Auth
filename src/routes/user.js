const { Router } = require("express")
const { getUser } = require("../controllers/user")
const { verifyAccessToken } = require("../middleware/auth")
const userRoutes = Router()

userRoutes.get("/users/:id", verifyAccessToken, getUser);


module.exports = userRoutes;