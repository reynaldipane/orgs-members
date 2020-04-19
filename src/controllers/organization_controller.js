const OrganizationService = require('../services/organization');
const asyncHandler = require('../utils/async_handler');
const validateResponse = require('../utils/validate_response');

const registerError = require('../errors/register_error');
const ErrCodes = require('../errors/codes');

const { OrganizationMemberList } = require('../responses/organization')

const { param } = require('express-validator/check');

module.exports = function(app) {
    const organizationService = new OrganizationService(app.githubClient);

    app.get('/orgs/:organization_name/members',
        [
            param('organization_name', 'organization_name can not be empty')
        ],
        registerError({
            [ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND]: 404,
            [ErrCodes.OrganizationError.require]: 403
        }),
        asyncHandler(async function(req) {
            return await organizationService.findMemberList(req.params.organization_name);
        }),
        validateResponse(OrganizationMemberList)
    )
}