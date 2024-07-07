const asyncWrapper = require("../middleware/asyncWrapper");
const client = require("../prismaInstance/client");
const customError = require("../utils/customError");

const getUserOrganisations = asyncWrapper(async (req, res) => {
    try {
        const userId = req.user.userId;

        const organisations = await client.organisation.findMany({
            where: {
                OrganisationUser: {
                    some: {
                        userId: userId,
                    },
                },
            },
            select: {
                orgId: true,
                name: true,
                description: true,
            },
        });

        res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: {
                organisations: organisations.map(org => ({
                    orgId: org.orgId,
                    name: org.name,
                    description: org.description,
                })),
            },
        });
    } catch (error) {
        console.log(error)
        throw customError("Client error", 400)

    }
});

module.exports = { getUserOrganisations };
