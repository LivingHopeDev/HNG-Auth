const client = require("../prismaInstance/client")
const asyncWrapper = require("../middleware/asyncWrapper")
const { validateUser } = require("../utils/fieldValidator")
const { hashSync, compareSync } = require("bcrypt");
const { createAccessToken } = require("../middleware/auth")
const customError = require("../utils/customError")



const register = asyncWrapper(async (req, res, next) => {
    await validateUser(req.body, next)
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
            })
            const orgName = `${firstName}'s Organisation`
            await tx.user.create({
                data: {
                    userId: newUser.userId,
                    name: orgName,

                },
            })
            const accessToken = createAccessToken({ id: newUser.userId })
            res.status(201).json({
                status: "success",
                message: "Registration successful",
                data: {
                    accessToken: accessToken,
                    user: {
                        ...newUser
                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
        throw customError("Registration unsuccessful", 400)
    }


})

module.exports = { register }