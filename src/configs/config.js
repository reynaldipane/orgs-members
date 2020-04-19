module.exports = {
    loadConfig: function () {
        const config = {
            githubAuth: process.env.GITHUB_TOKEN ? { auth: process.env.GITHUB_TOKEN } : {},
            port: process.env.PORT || 9001
        }
        
        return config;
    }
}