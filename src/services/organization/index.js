const assert = require('assert-plus');
const AppError = require('../../errors/error');
const ErrCodes = require('../../errors/codes');
const _ = require('underscore');

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

            throw new AppError(
                ErrCodes.OrganizationError.FIND_ORGANIZATION_MEMBERS_ERROR,
                'Error while finding organization members'
            )
        }

        let memberList = [];

        for (const member of members.data) {
            const followers = await this.findFollowerForUser(member.login);
            const following = await this.findFollowingForUser(member.login);
            memberList.push({
                login: member.login,
                avatar_url: member.avatar_url,
                followers: followers.length,
                following: following.length
            })
        }

        const sortedMemberByFollowers = _.sortBy(memberList, 'followers').reverse();

        return sortedMemberByFollowers;
    }

    async findFollowerForUser(username) {
        assert.string(username);

        let followers; 
        try {
            followers = await this.githubClient.users.listFollowersForUser({
                username: username
            })
        } catch (error) {
            throw new AppError(
                ErrCodes.OrganizationError.FIND_USER_FOLLOWERS_ERROR,
                'Error while finding user follower'
            )
        }

        return followers.data
    }

    async findFollowingForUser(username) {
        assert.string(username);

        let following;
        try {
            following = await this.githubClient.users.listFollowingForUser({
                username: username
            })
        } catch (error) {
            throw new AppError(
                ErrCodes.OrganizationError.FIND_USER_FOLLOWING_ERROR,
                'Error while finding user following'
            )
        }

        return following.data
    }
}

module.exports = OrganizationService;
