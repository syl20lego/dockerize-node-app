'use strict';

const request = require('supertest');

const app = require('../../server');

describe('test suite for server', () => {
    afterAll(() => {
        app.close();
    });
    it('should return 200 OK', (done) => {
        request(app)
            .get('/')
            .then((result) => {
                expect(result.statusCode).toBe(200);
            })
            .then(() => done())
            .catch(done);
    });

    it('should return 404 Not Found in json', (done) => {
        request(app)
            .get('/dummy')
            .set('Accept', 'application/json')
            .then((result) => {
                expect(result.statusCode).toBe(404);
                expect(result.body.message).toBe("Not Found");
                expect(result.body.error.status).toBe(404);
            })
            .then(() => done())
            .catch(done);
    });

    it('should return 404 Not Found in text', (done) => {
        request(app)
            .get('/dummy')
            .set('Accept', 'text/plain')
            .then((result) => {
                expect(result.statusCode).toBe(404);
                expect(result.res.statusMessage).toBe("Not Found");
            })
            .then(() => done())
            .catch(done);
    });
    it('should return 406 Not Accepted', (done) => {
        request(app)
            .get('/dummy')
            .set('Accept', 'application/xml')
            .then((result) => {
                console.log(result.res)
                expect(result.statusCode).toBe(406);
                expect(result.res.statusMessage).toBe("Not Acceptable");
            })
            .then(() => done())
            .catch(done);
    });
});