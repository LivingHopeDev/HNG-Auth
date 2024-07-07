require("dotenv").config()
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../src/middleware/auth'); // Ensure this path is correct

jest.mock('jsonwebtoken');

describe('createAccessToken', () => {
    const userId = 'user123';
    const token = 'mockedToken';
    const secret = 'testSecret';
    const expiresIn = '10s';

    beforeAll(() => {
        process.env.JWT_SECRET = secret;
    });

    it('should create a token with the correct payload', () => {
        jwt.sign.mockReturnValue(token);

        const generatedToken = createAccessToken(userId);
        console.log(generatedToken)
        expect(jwt.sign).toHaveBeenCalledWith({ userId }, secret, { expiresIn });
        expect(generatedToken).toBe(token);
    });

    it('should expire the token in 10 seconds', () => {
        const expires = Math.floor(Date.now() / 1000) + 10;
        const token = createAccessToken(userId);
        const decoded = jwt.verify(token, secret);
        console.log(decoded)
        expect(decoded.expiresIn).toBe(expires);
    });

    // it('should throw an error if JWT_SECRET is not defined', () => {
    //     delete process.env.JWT_SECRET;

    //     expect(() => createAccessToken(userId)).toThrow();
    // });
});
