require("dotenv").config()
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../src/middleware/auth');


describe('createAccessToken', () => {
    it('generates a token that expires in 30 seconds', () => {
        const userId = 1;
        const token = createAccessToken(userId);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken)
        expect(decodedToken.exp).toBeCloseTo(Math.round(Date.now() / 1000 + 30), 0);
    });

    it('includes the correct user details in the token', () => {
        const userId = 1;
        const token = createAccessToken(userId);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        expect(decodedToken.userId).toBe(userId);
    });


}, 20000);