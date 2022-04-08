const request = require('supertest');
const app = require('../app');
const C = require('../constants.js');
const mongoose = require('mongoose');

beforeAll(() => {
    mongoose.connect(C.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
    mongoose.Promise = global.Promise;
});

afterAll(() => {
    mongoose.connection.close();
});

describe('POST /api/user/login', () => {
    test('It should login with a valid username and password', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'DanTest', password:'dan'})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('It should fail with invalid username and password', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'fake', password:'news'})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('It should fail with no username provided', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({password:'password'})
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toEqual("username null");
    });

    test('It should fail with no password provided', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'username'})
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toEqual("password null");
    });
});

// describe('POST /api/user/register', () => {
//     test('It should fail with no email provided', async () => {
//         const response = await request(app)
//                                 .post('/api/user/register')
//                                 .send({username:'username', password: 'password'})
//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toEqual("email null");
//     });

//     test('It should fail with no username provided', async () => {
//         const response = await request(app)
//                                 .post('/api/user/register')
//                                 .send({email: "fake@email.com", password:'password'})
//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toEqual("username null");
//     });

//     test('It should fail with no password provided', async () => {
//         const response = await request(app)
//                                 .post('/api/user/register')
//                                 .send({email: "fake@email.com", username:'username'})
//         expect(response.statusCode).toBe(200);
//         expect(response.body.message    ).toEqual("password null");
//     });
// });
