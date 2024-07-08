const { PrismaClient } = require('@prisma/client')

// const client = new PrismaClient({
//     log: ["query"]
// })

const client = new PrismaClient()
module.exports = client