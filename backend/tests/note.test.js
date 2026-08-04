const request = require('supertest');
const chai = require('chai');
const app = require('../app');
const expect = chai.expect;

describe('Notes API', () => {
    let token = '';
    let noteId = '';
    const email = 'note' + Date.now() + '@test.com';

    before((done) => {
        request(app).post('/api/auth/signup')
            .send({ name: 'Umer', email: email, password: 'password123' })
            .end((err, signupRes) => {
                if (signupRes.status !== 201) {
                    console.log("BEFORE HOOK SIGNUP ERROR:", signupRes.body);
                }
                request(app).post('/api/auth/login')
                    .send({ email: email, password: 'password123' })
                    .end((err, res) => {
                        token = res.body.token;
                        done();
                    });
            });
    });

    
    it('should create note', (done) => {
        request(app).post('/api/notes')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'A', content: 'B' })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                noteId = res.body.noteId;
                done();
            });
    });


    it('should get notes', (done) => {
        request(app).get('/api/notes')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });


    it('should update note', (done) => {
        request(app).put('/api/notes/' + noteId)
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'C', content: 'D' })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });


    it('should delete note', (done) => {
        request(app).delete('/api/notes/' + noteId)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
});