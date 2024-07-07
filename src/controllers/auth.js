const client = require("../prismaInstance/client")
const asyncWrapper = require("../middleware/asyncWrapper")
const { validateUser } = require("../utils/fieldValidator")
const { hashSync, compareSync } = require("bcrypt");
const { createAccessToken } = require("../middleware/auth")
const customError = require("../utils/customError")



const register = asyncWrapper(async (req, res, next) => {
    await validateUser(req.body, "register")
    try {

        return await client.$transaction(async (tx) => {
            const { firstName, lastName, email, password } = req.body;

            const user = await tx.user.findFirst({ where: { email } });
            if (user) {
                return res.status(200).json({ message: "Email already exist" })
            }

            const newUser = await tx.user.create({
                data: {
                    ...req.body,
                    password: hashSync(password, 10),
                },
            });

            const orgName = `${firstName}'s Organisation`
            const organisation = await tx.organisation.create({
                data: {
                    name: orgName,
                },
            });

            await tx.organisationUser.create({
                data: {
                    userId: newUser.userId,
                    orgId: organisation.orgId,
                },
            });

            const accessToken = createAccessToken(newUser.userId)
            res.status(201).json({
                status: "success",
                message: "Registration successful",
                data: {
                    accessToken: accessToken,
                    user: {
                        userId: newUser.userId,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phone: newUser?.phone

                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
        throw customError("Registration unsuccessful", 400)
    }


})
const login = asyncWrapper(async (req, res) => {
    await validateUser(req.body)
    try {

        const { email, password } = req.body;

        const existingUser = await client.user.findFirst({ where: { email } });
        if (!existingUser) {
            throw customError("Authentication failed", 401)

        }
        if (!compareSync(password, existingUser.password)) {
            throw customError("Authentication failed", 401)
        }

        const accessToken = createAccessToken(existingUser.userId)
        res.status(201).json({
            status: "success",
            message: "Login successful",
            data: {
                accessToken: accessToken,
                user: {
                    userId: existingUser.userId,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    phone: existingUser?.phone
                }
            }
        })
    } catch (error) {
        console.log(error)
        throw customError("Authentication failed", 401)

    }
});

module.exports = { register, login }
