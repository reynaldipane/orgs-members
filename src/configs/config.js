module.exports = {
    loadConfig: function () {
        const config = {
            githubToken: process.env.GITHUB_TOKEN,
            port: process.env.PORT || 9001
        }
        
        return config;
    }
}