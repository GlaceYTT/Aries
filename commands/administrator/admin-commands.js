const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'admin-commands',
    description: 'Lists all available commands.',
    async execute(message) {
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const commandNames = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return `**!${command.name}**`;
        });

        if (commandNames.length > 0) {
            const commandsEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Commands')
                .setDescription(commandNames.join('\n'))
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [commandsEmbed] });
        } else {
            const noCommandsEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('No Commands Available')
                .setDescription('There are no commands available at the moment.')
                .setTimestamp();

            message.channel.send({ embeds: [noCommandsEmbed] });
        }
    },
};
