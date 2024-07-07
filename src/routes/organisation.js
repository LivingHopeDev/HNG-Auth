const { Router } = require("express")
const { getUserOrganisations } = require("../controllers/organisation")
const { verifyAccessToken } = require("../middleware/auth")
const orgRoutes = Router()

orgRoutes.get("/organisations", verifyAccessToken, getUserOrganisations);


module.exports = orgRoutes;