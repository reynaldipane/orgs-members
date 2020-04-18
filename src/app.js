const express = require('express');
const githubClient = require('@octokit/rest');

const apiLoader = require('./utils/api_loader');
const config = require('./configs/config');

require('dotenv').config()

const app = express();

app.config = config.loadConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.githubClient = new githubClient.Octokit({ auth: app.config.githubToken });

apiLoader.load(app, __dirname);
app.use(require('./middlewares/response')());

app.listen(app.config.port);

module.exports = app;
