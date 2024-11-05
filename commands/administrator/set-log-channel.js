const { updateLogChannel } = require('../../models/logs');
const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
module.exports = {
    name: 'set-log-channel',
    description: 'Set the log channel for a specific category',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }
        if (args.length < 2) {
            return message.reply('Usage: !set-log-channel <category> <channel ID>');
        }

        const [category, channelId] = args;
        const validCategories = [
            'ban_logs', 'timeout_logs', 'deleted_logs', 'edit_logs', 'kick_logs', 
            'warn_logs', 'fortnite_logs', 'role_logs', 'other_logs' , 'level_logs'
        ];

        if (!validCategories.includes(category)) {
            return message.reply('Invalid category. Valid categories are: ' + validCategories.join(', '));
        }

        await updateLogChannel(message.guild.id, category, channelId);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setAuthor({ name: 'Log Channel Assigned', iconURL: 'https://cdn.discordapp.com/emojis/770663775971966976.gif' })
            .setFooter({ text: 'Use !show-log-channels to view set channels.', iconURL: 'https://cdn.discordapp.com/emojis/942629018296025128.gif' })
            .setDescription(`Successfully set the log channel for **${category}** to <#${channelId}>`)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
