const { getUserCommands } = require('../../models/customCommands');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'show-commands',
    description: 'Shows all custom commands set by the user.',
    async execute(message) {
        const userId = message.author.id;
        const commands = await getUserCommands(userId);

        if (commands.length === 0) {
            const noCommandsEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('No Custom Commands')
                .setDescription('You have not set any custom commands.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noCommandsEmbed] });
        }

        const commandList = commands.map(cmd => `\`${cmd.commandName}\`: ${cmd.response}`).join('\n');

        const commandsEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: 'Your Custom commands list', iconURL: 'https://cdn.discordapp.com/emojis/839462739071991808.gif' })
            .setFooter({ text: 'All custom commands available.', iconURL: 'https://cdn.discordapp.com/emojis/1052709570558046308.gif' })
            .setDescription(commandList)
            .setTimestamp();

        message.reply({ embeds: [commandsEmbed] });
    },
};
