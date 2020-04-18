const expect = require('expect.js');
const sinon = require('sinon');
const OrganizationService = require('../../../src/services/organization');

describe('OrganizationService integration test', () => {
    const githubClientMocks = {
        orgs: {
            listMembers: function(){}
        },
        users: {
            listFollowersForUser: function(){},
            listFollowingForUser: function(){}
        }
    };

    let organizationService;

    before(() => {
        organizationService = new OrganizationService(githubClientMocks);
    });

    describe('findMemberList test', () => {
        it('should return organization\'s member list', async () => {
            const listMembersStub = sinon.stub(organizationService.githubClient.orgs, 'listMembers');
            const listFollowersForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowersForUser');
            const listFollowingForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowingForUser');

            listMembersStub.resolves({
                data: [
                    {
                        login: 'test-login-1',
                        avatar_url: 'test-avatar-url-1'
                    }
                ]
            });

            listFollowersForUserStub.resolves({
                data: [
                    {
                        login: 'test-followers-login-1',
                        avatar_url: 'test-followers-avatar-url-1'
                    }
                ]
            });

            listFollowingForUserStub.resolves({
                data: [
                    {
                        login: 'test-following-login-1',
                        avatar_url: 'test-following-avatar-url-1'
                    }
                ]
            });

            const result = await organizationService.findMemberList('test-organization-name');

            expect(result).to.be.an('array');
            expect(result.length).to.be.greaterThan(0);
            
            listMembersStub.restore();
            listFollowersForUserStub.restore();
            listFollowingForUserStub.restore();
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

    describe('findFollowerForUser test', () => {
        it('should return user\'s followers', async () => {
            const listFollowersForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowersForUser');
            listFollowersForUserStub.resolves({
                data: [
                    {
                        login: 'test-followers-login-1',
                        avatar_url: 'test-followers-avatar-url-1'
                    }
                ]
            });

            const result = await organizationService.findFollowerForUser('test-user-1');

            expect(result).to.be.an('array');
            expect(result.length).to.be.greaterThan(0);

            listFollowersForUserStub.restore();
        });

        it('should throws FIND_USER_FOLLOWERS_ERROR', async () => {
            const listFollowersForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowersForUser');
            listFollowersForUserStub.rejects({ code: 'test-error' });

            try {
                await organizationService.findFollowerForUser('test-user-1');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('FIND_USER_FOLLOWERS_ERROR')
            }

            listFollowersForUserStub.restore();
        });
    });

    describe('findFollowingForUser test', () => {
        it('should return user\'s following', async () => {
            const listFollowingForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowingForUser');
            listFollowingForUserStub.resolves({
                data: [
                    {
                        login: 'test-following-login-1',
                        avatar_url: 'test-following-avatar-url-1'
                    }
                ]
            });

            const result = await organizationService.findFollowingForUser('test-user-1');

            expect(result).to.be.an('array');
            expect(result.length).to.be.greaterThan(0);

            listFollowingForUserStub.restore();
        });

        it('should throws FIND_USER_FOLLOWING_ERROR', async () => {
            const listFollowingForUserStub = sinon.stub(organizationService.githubClient.users, 'listFollowingForUser');
            listFollowingForUserStub.rejects({ code: 'test-error' });

            try {
                await organizationService.findFollowingForUser('test-user-1');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('FIND_USER_FOLLOWING_ERROR')
            }

            listFollowingForUserStub.restore();
        });
    });
});
