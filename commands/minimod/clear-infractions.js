const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { clearInfractions } = require('../../models/infraction');

module.exports = {
    name: 'clear-infractions',
    description: 'Clears all infractions or specific type for a mentioned user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to clear infractions.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Missing User')
                    .setDescription('Please mention a user to clear their infractions.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const infractionType = args[1]?.toLowerCase(); 

            const member = message.guild.members.resolve(user);
            if (!member) {
                const embed = new EmbedBuilder()
                    .setTitle('User Not Found')
                    .setDescription('That user isn\'t in this guild.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            await clearInfractions(user.id, infractionType);

            const embed = new EmbedBuilder()
                .setTitle('Infractions Cleared')
                .setDescription(infractionType 
                    ? `All ${infractionType} infractions for ${user} have been cleared.` 
                    : `All infractions for ${user} have been cleared.`)
                .setColor('#00FF00');

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [embed] });
        }
    },
};
