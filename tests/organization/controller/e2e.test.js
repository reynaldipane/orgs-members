const request = require('supertest');
const expect = require('expect.js');
const app = require('../../../src/app');

const TIME_OUT = 60000;

describe('OrganizationController E2E test', function() {
    this.timeout(TIME_OUT);

    describe('GET /orgs/:organization_name/members test', () => {
        it('should response with list of organization\'s member', (done) => {
            request(app)
                .get('/orgs/xendit/members')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });

        it('should throw ORGANIZATION_NOT_FOUND error', (done) => {
            request(app)
                .get('/orgs/xendit/members')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
});