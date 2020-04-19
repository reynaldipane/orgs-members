const expect = require('expect.js');
const sinon = require('sinon');
const OrganizationService = require('../../../src/services/organization');

describe('OrganizationService integration test', () => {
    const githubClientMocks = {
        orgs: {
            listMembers: function(){}
        },
        users: {
            getByUsername: function(){}
        }
    };

    let organizationService;

    before(() => {
        organizationService = new OrganizationService(githubClientMocks);
    });

    describe('findMemberList test', () => {
        it('should return organization\'s member list', async () => {
            const listMembersStub = sinon.stub(organizationService.githubClient.orgs, 'listMembers');
            const getByUsernameStub = sinon.stub(organizationService.githubClient.users, 'getByUsername');

            listMembersStub.resolves({
                data: [
                    {
                        login: 'test-login-1',
                        avatar_url: 'test-avatar-url-1'
                    }
                ]
            });

            getByUsernameStub.resolves({
                data:{
                    login: 'test-user-1',
                    avatar_url: 'test-user-1-avatar-url',
                    following: 10,
                    followers: 15
                }
            });

            const result = await organizationService.findMemberList('test-organization-name');

            expect(result).to.be.an('array');
            expect(result.length).to.be.greaterThan(0);
            
            listMembersStub.restore();
            getByUsernameStub.restore();
        });

        it('should throws ORGANIZATION_NOT_FOUND error', async () => {
            const listMembersStub = sinon.stub(organizationService.githubClient.orgs, 'listMembers');
            listMembersStub.rejects({ code: 404 });

            try {
                await organizationService.findMemberList('test-not-found-orgz');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('ORGANIZATION_NOT_FOUND');

            }

            listMembersStub.restore();
        });

        it('should throws GITHUB_API_RATE_LIMIT_ERROR error', async () => {
            const listMembersStub = sinon.stub(organizationService.githubClient.orgs, 'listMembers');
            listMembersStub.rejects({ code: 403 });

            try {
                await organizationService.findMemberList('test-error-api-limit');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('GITHUB_API_RATE_LIMIT_ERROR');

            }

            listMembersStub.restore();
        });

        it('should throws FIND_ORGANIZATION_MEMBERS_ERROR error', async () => {
            const listMembersStub = sinon.stub(organizationService.githubClient.orgs, 'listMembers');
            listMembersStub.rejects({ code: 'test-error' });

            try {
                await organizationService.findMemberList('test-not-found-orgz');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('FIND_ORGANIZATION_MEMBERS_ERROR');

            }

            listMembersStub.restore();
        });
    });

    describe('getUserByUsername test', () => {
        it('should return user\'s data', async () => {
            const getByUsernameStub = sinon.stub(organizationService.githubClient.users, 'getByUsername');
            getByUsernameStub.resolves({
                data:{
                    login: 'test-user-1',
                    avatar_url: 'test-user-1-avatar-url',
                    following: 10,
                    followers: 15
                }
            });

            const result = await organizationService.getUserByUsername('test-user-1');
            expect(result).to.be.an('object');
            expect(result.following).to.be.a('number');
            expect(result.followers).to.be.a('number');

            getByUsernameStub.restore();
        });

        it('should throws FIND_USER_ERROR', async () => {
            const getByUsernameStub = sinon.stub(organizationService.githubClient.users, 'getByUsername');
            getByUsernameStub.rejects({ code: 'test-error' });

            try {
                await organizationService.getUserByUsername('test-user-1');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('FIND_USER_ERROR')
            }

            getByUsernameStub.restore();
        });

        it('should throws GITHUB_API_RATE_LIMIT_ERROR', async () => {
            const getByUsernameStub = sinon.stub(organizationService.githubClient.users, 'getByUsername');
            getByUsernameStub.rejects({ code: 403 });

            try {
                await organizationService.getUserByUsername('test-user-1');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('GITHUB_API_RATE_LIMIT_ERROR')
            }

            getByUsernameStub.restore();
        });
    });
});
