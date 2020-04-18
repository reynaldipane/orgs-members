'use strict';

const Joi = require('joi');

const User = Joi.object().keys({
    login: Joi.string().required(),
    avatar_url: Joi.string().optional(),
    followers: Joi.number().optional(),
    following: Joi.number().optional()
})

module.exports = {
    OrganizationMemberList: Joi.array().items(User).optional()
}