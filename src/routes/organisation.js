const { Router } = require("express")
const { getUserOrganisations, addUserToOrganisation, getOrganisation, createOrganisation } = require("../controllers/organisation")
const { verifyAccessToken } = require("../middleware/auth")
const orgRoutes = Router()

orgRoutes.get("/organisations", verifyAccessToken, getUserOrganisations);
orgRoutes.get("/organisations/:orgId", verifyAccessToken, getOrganisation);
orgRoutes.post("/organisations", verifyAccessToken, createOrganisation);

orgRoutes.post("/organisations/:orgId/users", verifyAccessToken, addUserToOrganisation);


module.exports = orgRoutes;