const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'economy-commands',
    description: 'Lists all available commands.',
    async execute(message) {
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const commandNames = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return `**!${command.name}**`;
        });

        const embed = new EmbedBuilder()
            .setTitle('Server Commands')
            .setDescription(commandNames.length > 0 ? commandNames.join('\n') : 'No commands available.')
            .setColor('#0099ff')
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};
