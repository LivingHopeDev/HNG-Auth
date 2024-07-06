const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient({
    log: ["query"]
})
module.exports = client