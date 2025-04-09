const request = require('supertest');
const expect = require('chai').expect;


describe('test server', function () {
    let server;

    beforeEach(function () {
        server = require('./server.js');
    });

    afterEach(function () {
        server.close();
    });

    it('responds to /api/home/', (done) => {
        request(server).get('/api/home/').expect(200, done);
    });

    it('404 other urls', (done) => {
        request(server).get('/should404').expect(404, done);
    });

    it('returns a user', (done) => {
        const user = {
            firstName: 'Jimmy',
            email: 'jimmy@gmail.com',
            password: 'iamnotfondoficecream1234',
        };
        request(server).get('/api/get-user/2').expect(200).end((err, res) => {
            expect(res.body.user.firstName).to.equal(user.firstName);
            expect(res.body.user.email).to.equal(user.email);
            expect(res.body.user.password).to.equal(user.password);
            done();
        });
    });

    it('posts a user', (done) => {
        const user = {
            first_name: 'Timmy',
            email: 'Timmy@gmail.com',
            password: 'password123',
        };
        request(server).post(
            '/api/users/'
        ).type('application/json').send(user).expect(200).end((err, res) => {
            expect(res.body.message).to.equal('User created successfully');
            done();
        });
    });

    it('should respond with 404 an error if user with id is not found', (done) => {
        request(server).get('/api/get-user/5').expect(404).end((err, res) => {
            expect(res.body.errors[0]).to.equal('User not found');
            done();
        });
    });

    describe('post user validation', () => {
        it('should validate that a password is provided and that it is at least 8 characters long', async () => {
            const user = {
                first_name: 'Timmy',
                email: 'Timmy@gmail.com',
                password: 'short',
            }

            const shortPasswordRes = await request(server).post('/api/users/').send(user).expect(404);
            expect(shortPasswordRes.body.errors.password.msg).to.equal('Password must be at least 8 characters');

            user.password = undefined;
            await request(server).post('/api/users/').send(user).expect(404);
        });

        it('should validate that all attributes are provided and return a 404 error', async () => {
            const user = {
                first_name: 'Timmy',
                email: 'Timmy@gmail.com',
                password: 'password123456',
            }

            await request(server).post('/api/users/').send(user).expect(200);
            await request(server).post('/api/users/').send({
                ...user,
                first_name: undefined
            }).expect(404);
            await request(server).post('/api/users/').send({
                ...user,
                email: undefined
            }).expect(404);
        })
    })
});
