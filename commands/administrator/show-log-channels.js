const { getAllLogChannels } = require('../../models/logs');
const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
module.exports = {
    name: 'show-log-channels',
    description: 'Show all log channels set for this server',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }
        const logChannels = await getAllLogChannels(message.guild.id);

        if (!logChannels) {
            return message.reply('No log channels have been set for this server.');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setAuthor({ name: 'Server Log Channels', iconURL: 'https://cdn.discordapp.com/emojis/924186269859344394.gif' })
            .setDescription('- Here are the current log channels set for this server :')
            .addFields(
                { name: 'Ban Logs', value: logChannels.ban_logs ? `<#${logChannels.ban_logs}>` : 'Not set', inline: true },
                { name: 'Timeout Logs', value: logChannels.timeout_logs ? `<#${logChannels.timeout_logs}>` : 'Not set', inline: true },
                { name: 'Deleted Logs', value: logChannels.deleted_logs ? `<#${logChannels.deleted_logs}>` : 'Not set', inline: true },
                { name: 'Edit Logs', value: logChannels.edit_logs ? `<#${logChannels.edit_logs}>` : 'Not set', inline: true },
                { name: 'Kick Logs', value: logChannels.kick_logs ? `<#${logChannels.kick_logs}>` : 'Not set', inline: true },
                { name: 'Warn Logs', value: logChannels.warn_logs ? `<#${logChannels.warn_logs}>` : 'Not set', inline: true },
                { name: 'Fortnite Logs', value: logChannels.fortnite_logs ? `<#${logChannels.fortnite_logs}>` : 'Not set', inline: true },
                { name: 'Role Logs', value: logChannels.role_logs ? `<#${logChannels.role_logs}>` : 'Not set', inline: true },
                { name: 'Other Logs', value: logChannels.other_logs ? `<#${logChannels.other_logs}>` : 'Not set', inline: true },
                { name: 'Level Logs', value: logChannels.level_logs ? `<#${logChannels.level_logs}>` : 'Not set', inline: true },
            )
            .setFooter({ text: 'Execute !set-log-channel Command to setup.', iconURL: 'https://cdn.discordapp.com/emojis/942629018296025128.gif' })
            .setTimestamp();
            
        return message.reply({ embeds: [embed] });
    }
};
