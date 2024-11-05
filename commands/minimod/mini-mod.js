const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'minimod-commands',
    description: 'Lists all available commands.',
    async execute(message) {
        try {
            const commandsPath = path.join(__dirname); 
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            const commandNames = commandFiles.map(file => {
                const command = require(path.join(commandsPath, file));
                return `**!${command.name}**`;
            });

            const embed = new EmbedBuilder()
                .setTitle('Available Commands')
                .setDescription(`${message.author}, here are the available server commands:\n\n${commandNames.join('\n')}`)
                .setColor('#00FF00');

            if (commandNames.length > 0) {
                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.send('No commands available.');
            }
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
