const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, 'config.json');

let config = require(configPath);

module.exports = {
    mongodbUri: config.mongodbUri,
    prefix: config.prefix,
    commandSettings: config.commandSettings,

    updateCommandSettings: (newSettings) => {
        config.commandSettings = newSettings;

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    },


    getCommandSettings: () => {
        return config.commandSettings;
    }
};
