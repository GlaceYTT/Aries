const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');

module.exports = {
    name: 'remove-timeout',
    description: 'Removes the timeout from a user with an optional reason.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to remove timeouts from members.');
                return message.reply({ embeds: [noPermsEmbed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const noMentionEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Error')
                    .setDescription('Please mention a user to remove their timeout.');
                return message.reply({ embeds: [noMentionEmbed] });
            }

            const member = message.guild.members.resolve(user);
            if (!member) {
                const userNotInGuildEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Error')
                    .setDescription('That user isn\'t in this guild.');
                return message.reply({ embeds: [userNotInGuildEmbed] });
            }

            const isTimedOut = member.communicationDisabledUntil > new Date();
            if (!isTimedOut) {
                const notTimedOutEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Error')
                    .setDescription('This user is not currently timed out.');
                return message.reply({ embeds: [notTimedOutEmbed] });
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';

            await member.timeout(null, reason);

            await updateInfraction(user.id, 'remove-timeouts');

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('User Timeout Removed')
                .setDescription(`${user} has had their timeout removed.`)
                .addFields({ name: 'Reason', value: reason })
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('There was an error executing that command.');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
