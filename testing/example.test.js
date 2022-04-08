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
});

describe('POST /api/user/login', () => {
    test('It should fail with invalid username and password', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'fake', password:'news'})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});