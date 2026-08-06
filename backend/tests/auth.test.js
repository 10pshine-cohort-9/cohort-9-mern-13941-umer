const request = require('supertest');
const chai = require('chai');
const app = require('../app');
const expect = chai.expect;

describe('Auth API', () => {
    const email = 'user' + Date.now() + '@test.com';

    it('should register', (done) => {
        request(app).post('/api/auth/signup')
            .send({ name: 'Umer', email: email, password: 'password123' })
            .end((err, res) => {
                if (res.status !== 201) {
                    console.log("SIGNUP ERROR:", res.body); 
                }
                expect(res.status).to.equal(201);
                done();
            });
    });

    it('should login', (done) => {
        request(app).post('/api/auth/login')
            .send({ email: email, password: 'password123' })
            .end((err, res) => {
                if (res.status !== 200) {
                    console.log("LOGIN ERROR:", res.body);
                }
                expect(res.status).to.equal(200);
                done();
            });
    });
});