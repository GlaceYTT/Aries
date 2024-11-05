const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'kick',
    description: 'Kicks a user and logs the infraction.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return message.reply('You do not have permission to kick members.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to kick.');

            const member = message.guild.members.resolve(user);
            if (!member) return message.reply('That user isn\'t in this guild.');

            const reason = args.slice(1).join(' ') || 'No reason provided';

            await member.kick(reason);

            // Update the infraction with detailed information
            await updateInfraction(user.id, 'kick', reason, message.author.tag);

            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('User Kicked')
                .setDescription(`${user.tag} has been kicked.`)
                .addFields(
                    { name: 'Kicked by', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason, inline: true }
                )
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });

            const logChannelId = await getLogChannel(message.guild.id, 'kick_logs');
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
