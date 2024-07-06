const { Router } = require("express")
const { register, login } = require("../controllers/auth")

const authRoutes = Router()

authRoutes.post("/register", register);
authRoutes.post("/login", login);


module.exports = authRoutes;