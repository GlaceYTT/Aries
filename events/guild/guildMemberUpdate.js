const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        // Fetch the log channel for role updates
        const logChannelId = await getLogChannel(newMember.guild.id, 'role_logs');
        if (!logChannelId) return;

        const logChannel = newMember.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Compare roles before and after the update
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        // If no roles were added or removed, exit early
        if (addedRoles.size === 0 && removedRoles.size === 0) return;

        let description = `${newMember.user} has updated roles:\n\n`;

        if (addedRoles.size > 0) {
            description += `**Roles Added:** ${addedRoles.map(role => `<@&${role.id}>`).join(', ')}\n`;
        }

        if (removedRoles.size > 0) {
            description += `**Roles Removed:** ${removedRoles.map(role => `<@&${role.id}>`).join(', ')}`;
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Role Update')
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: `User ID: ${newMember.id}`, iconURL: newMember.user.displayAvatarURL() });

        logChannel.send({ embeds: [embed] });
    },
};
