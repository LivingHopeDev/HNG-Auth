const { Router } = require("express")
const { getUser } = require("../controllers/auth")

const authRoutes = Router()

authRoutes.post("/user/:id", getUser);


module.exports = authRoutes;