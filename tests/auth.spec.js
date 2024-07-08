const app = require('../index');
const request = require('supertest');

describe('Registration', () => {
    it('Should register user successfully with default organisation', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe4313@example.com',
            password: 'password123'
        };

        const response = await request(app).post("/auth/register").send(userData)

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Registration successful');
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.firstName).toBe(userData.firstName);
        expect(response.body.data.user.lastName).toBe(userData.lastName);
        expect(response.body.data.user.email).toBe(userData.email);
    });

})
describe('Should Log the user in successfully', () => {
    it('Should log the user in with correct credentials', async () => {
        const userData = {
            email: 'johndoe@example.com',
            password: 'password123'
        };


        const response = await request(app).post("/auth/login").send(userData)

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.email).toBe(userData.email);
        expect(response.body.data.user.firstName).toBeDefined();
        expect(response.body.data.user.lastName).toBeDefined();
    });

    it('Should fail to log in with invalid credentials', async () => {
        const userData = {
            email: 'invalid@example.com',
            password: 'wrongpassword'
        };


        const response = await request(app).post("/auth/login").send(userData)
        expect(response.status).toBe(401);
        expect(response.body.status).toBe('Bad request');
        expect(response.body.message).toBe('Authentication failed');
    });
})

describe('Should Fail If Required Fields Are Missing', () => {
    it('Should fail if firstName is missing', async () => {
        const userData = {
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        };

        const response = await request(app).post("/auth/register").send(userData)
        expect(response.status).toBe(422);
        expect(response.body.errors).toEqual([
            { field: 'firstName', message: 'firstName is required' }
        ]);
    });

    it('Should fail if lastName is missing', async () => {
        const userData = {
            firstName: 'John',
            email: 'johndoe@example.com',
            password: 'password123'
        };

        const response = await request(app).post("/auth/register").send(userData)
        expect(response.status).toBe(422);
        expect(response.body.errors).toEqual([
            { field: 'lastName', message: 'lastName is required' }
        ]);
    });

    it('Should fail if email is missing', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        };

        const response = await request(app).post("/auth/register").send(userData)
        expect(response.status).toBe(422);
        expect(response.body.errors).toEqual([
            { field: 'email', message: 'email is required' }
        ]);
    });

    it('Should fail if password is missing', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com'
        };

        const response = await request(app).post("/auth/register").send(userData)
        expect(response.status).toBe(422);
        expect(response.body.errors).toEqual([
            { field: 'password', message: 'password is required' }
        ]);
    });
})

describe('Duplicate Email ', () => {
    it('Should fail if email is already in use', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        };

        // Register the first user
        await request(app).post("/auth/register").send(userData)

        // Attempt to register a second user with the same email
        const response = await request(app).post("/auth/register").send(userData)

        expect(response.status).toBe(422);
        expect(response.body.message).toBe('Email already exist');

    });


});
afterAll(async () => {
    await app.close
});