const asyncWrapper = require("../middleware/asyncWrapper");
const client = require("../prismaInstance/client");
const customError = require("../utils/customError");
const { validateUser } = require("../utils/fieldValidator")

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
        throw customError("Client error", 400)

    }
});



const getOrganisation = asyncWrapper(async (req, res) => {
    // try {
    const { orgId } = req.params;
    const { userId } = req.user;
    const organisation = await client.organisation.findFirst({
        where: {
            orgId: orgId,
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

    if (!organisation) {
        throw customError("Client error", 401)

    }

    res.status(200).json({
        status: 'success',
        message: 'Organisation retrieved successfully',
        data: {
            orgId: organisation.orgId,
            name: organisation.name,
            description: organisation.description,
        },
    });
    // } catch (error) {
    //     console.log(error)
    //     throw customError("Client error", 400)

    // }
});


const addUserToOrganisation = asyncWrapper(async (req, res) => {
    try {
        const { orgId } = req.params;
        const { userId } = req.body;

        const organisation = await client.organisation.findUnique({
            where: { orgId: orgId },
        });

        if (!organisation) {
            throw customError("Client error", 400)

        }

        const user = await client.user.findUnique({
            where: { userId: userId },
        });

        if (!user) {

            throw customError("Client error", 400)

        }
        const existingEntry = await client.organisationUser.findFirst({
            where: {

                userId: userId,
                orgId: orgId,
            },
        });

        if (existingEntry) {

            throw customError("Client error", 400)

        }
        await client.organisationUser.create({
            data: {
                userId: userId,
                orgId: orgId,
            },
        });




        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
        });
    } catch (error) {
        console.log(error)
        throw customError("Client error", 400)

    }
});



const createOrganisation = asyncWrapper(async (req, res) => {
    await validateUser(req.body);
    try {
        const { userId } = req.user;
        const { name, description } = req.body;
        const orgName = `${name}'s Organisation`;

        const newOrganisation = await client.organisation.create({
            data: {
                name: orgName,
                description,
            },
            select: {
                orgId: true,
                name: true,
                description: true,
            },
        });
        await client.organisationUser.create({
            data: {
                userId: userId,
                orgId: newOrganisation.orgId,
            },
        });

        res.status(200).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
                orgId: newOrganisation.orgId,
                name: newOrganisation.name,
                description: newOrganisation.description,
            },
        });
    } catch (error) {
        console.error(error);
        throw customError("Client error", 400);
    }
});







module.exports = { getUserOrganisations, addUserToOrganisation, getOrganisation, createOrganisation };
