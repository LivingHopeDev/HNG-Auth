const { Router } = require("express")
const { register } = require("../controllers/auth")

const authRoutes = Router()

authRoutes.post("/register", register);

module.exports = authRoutes;