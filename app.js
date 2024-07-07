const express = require("express")
const client = require("./src/prismaInstance/client")
const authRoutes = require("./src/routes/auth")
const userRoutes = require("./src/routes/user")
const notFound = require("./src/middleware/notFound")
const errorHandlerMiddleware = require("./src/middleware/errorHandler")
const orgRoutes = require("./src/routes/organisation")

require("dotenv").config()

const port = process.env.PORT
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api", orgRoutes)




app.use(notFound)
app.use(errorHandlerMiddleware)
app.listen(port, () => {
    console.log(`Server running http:localhost:${port}`)
})

