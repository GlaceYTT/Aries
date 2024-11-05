const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'ban',
    description: 'Bans a user and logs the infraction.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return message.reply('You do not have permission to ban members.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to ban.');

            const member = message.guild.members.resolve(user);
            if (!member) return message.reply('That user isn\'t in this guild.');

            const reason = args.slice(1).join(' ') || 'No reason provided';
            const moderator = message.author.tag;

            await member.ban({ reason });

            // Update the infraction with detailed information
            await updateInfraction(user.id, 'ban', reason, moderator);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Banned')
                .setDescription(`${user.tag} has been banned.`)
                .addFields(
                    { name: 'Moderator', value: moderator, inline: true },
                    { name: 'Reason', value: reason, inline: true }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });

            const logChannelId = await getLogChannel(message.guild.id, 'ban_logs');
            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [embed] });
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found in guild.`);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
