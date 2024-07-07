const asyncWrapper = require("../middleware/asyncWrapper");
const client = require("../prismaInstance/client");
const customError = require("../utils/customError");

const getUser = asyncWrapper(async (req, res) => {

    try {
        const { id } = req.params;
        const currentUser = req.user;

        const currentUserData = await client.user.findUnique({
            where: { userId: currentUser.userId },
            include: { OrganisationUser: true },
        });
        const requestedUserData = await client.user.findUnique({
            where: { userId: id },
            include: { OrganisationUser: true },
        });

        if (!requestedUserData) {
            throw customError("Client error", 400)
        }

        // If currentUser is requesting their own details
        if (currentUser.userId === id) {
            return res.status(200).json({
                status: "success",
                message: "Your details",
                data: {
                    userId: currentUserData.userId,
                    firstName: currentUserData.firstName,
                    lastName: currentUserData.lastName,
                    email: currentUserData.email,
                    phone: currentUserData?.phone

                }
            })
        }
        // return the requested user details
        return res.status(200).json({
            status: "success",
            message: "Requested user details",
            data: {
                userId: currentUserData.userId,
                firstName: currentUserData.firstName,
                lastName: currentUserData.lastName,
                email: currentUserData.email,
                phone: currentUserData?.phone

            }
        })


    } catch (error) {
        throw customError("Client error", 400)

    }


})


module.exports = { getUser }