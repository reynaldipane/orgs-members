const assert = require('assert-plus');
const AppError = require('../../errors/error');
const ErrCodes = require('../../errors/codes');
const _ = require('underscore');
const { fork } = require('child_process');
class OrganizationService {
    constructor(githubClient) {
        assert.object(githubClient);
        this.githubClient = githubClient
    }

    async findMemberList(organizationName) {
        assert.string(organizationName);

        let members;
        try {
            members = await this.githubClient.orgs.listMembers({
                org: organizationName
            })            
        } catch (error) {
            if (error && error.code == 404) {
                throw new AppError(
                    ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND,
                    'Organization not found'
                )
            }

            if (error && error.code == 403) {
                throw new AppError(
                    ErrCodes.OrganizationError.GITHUB_API_RATE_LIMIT_ERROR,
                    'Request exceeding rate limit, please wait for 1 hour or attach your GITHUB_TOKEN in env variables'
                )
            }

            throw new AppError(
                ErrCodes.OrganizationError.FIND_ORGANIZATION_MEMBERS_ERROR,
                'Error while finding organization members'
            )
        }

        let memberList = [];
        for (const member of members.data) {
            const user = await this.getUserByUsername(member.login);
            memberList.push({
                login: member.login,
                avatar_url: member.avatar_url,
                followers: user.followers,
                following: user.following
            });
        }

        const sortedMemberByFollowers = _.sortBy(memberList, 'followers').reverse();

        return sortedMemberByFollowers;
    }

    async getUserByUsername(username) {
        assert.string(username);

        let user;
        try {
            user = await this.githubClient.users.getByUsername({
                username: username
            });
        } catch (error) {
            if (error && error.code == 403) {
                throw new AppError(
                    ErrCodes.OrganizationError.GITHUB_API_RATE_LIMIT_ERROR,
                    'Request exceeding rate limit, please wait for 1 hour or attach your GITHUB_TOKEN in env variables'
                )
            }

            throw new AppError(
                ErrCodes.OrganizationError.FIND_USER_ERROR
            )
        }

        return user.data
    }
}

module.exports = OrganizationService;
