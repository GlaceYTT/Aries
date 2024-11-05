const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'timeout',
    description: 'Times out a user for a specified duration with a reason.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return message.reply('You do not have permission to timeout members.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to timeout.');

            const member = message.guild.members.resolve(user);
            if (!member) return message.reply('That user isn\'t in this guild.');

            const time = parseInt(args[1], 10);
            if (isNaN(time) || time <= 0) {
                return message.reply('Please provide a valid time in minutes.');
            }

            const reason = args.slice(2).join(' ') || 'No reason provided';
            const timeoutDuration = time * 60 * 1000; 

            await member.timeout(timeoutDuration, reason);

            // Update the infraction with detailed information
            await updateInfraction(user.id, 'timeout', reason, message.author.tag);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Timed Out')
                .setDescription(`${user} has been timed out for ${time} minutes.`)
                .addFields(
                    { name: 'Moderator', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason, inline: true }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });

            const logChannelId = await getLogChannel(message.guild.id, 'timeout_logs');
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
