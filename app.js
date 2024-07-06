const express = require("express")
const client = require("./src/prismaInstance/client")
const authRoutes = require("./src/routes/auth")
const notFound = require("./src/middleware/notFound")
const errorHandlerMiddleware = require("./src/middleware/errorHandler")

require("dotenv").config()

const port = process.env.PORT
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// require("./src/prismaInstance/client")
app.use("/auth", authRoutes)
// app.post("/auth/register", async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;
//     // await validateUser(req.body, next)

//     let user = await client.user.findFirst({ where: { email } });
//     console.log(user)
// })

app.use(notFound)
app.use(errorHandlerMiddleware)
app.listen(port, () => {
    console.log(`Server running http:localhost:${port}`)
})

