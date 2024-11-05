const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'fortnite-commands',
    description: 'Lists all available commands.',
    async execute(message) {
        const commandsPath = path.join(__dirname); 
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const commandNames = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return `**!${command.name}**`;
        });

        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription(commandNames.length > 0 
                ? `${message.author} Here are the Server Commands:\n\n${commandNames.join('\n')}` 
                : 'No commands available.')
            .setColor(commandNames.length > 0 ? '#00FF00' : '#FF0000');

        message.channel.send({ embeds: [embed] });
    },
};
