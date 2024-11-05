const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove-verified',
    description: 'Removes the verified role from the mentioned user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to manage roles.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noPermsEmbed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const noMentionEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please mention a user to remove the verified role.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noMentionEmbed] });
            }

            const member = message.guild.members.resolve(user);
            if (!member) {
                const userNotInGuildEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('That user isn\'t in this guild.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [userNotInGuildEmbed] });
            }

            const verifiedRole = message.guild.roles.cache.find(role => role.name === 'Verified');
            if (!verifiedRole) {
                const roleNotFoundEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Verified role not found.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [roleNotFoundEmbed] });
            }

            await member.roles.remove(verifiedRole);

            const successEmbed = new EmbedBuilder()
                .setTitle('Role Updated')
                .setDescription(`${message.author} successfully removed Verified from ${user}.`)
                .setColor('#00FF00');

            message.reply({ embeds: [successEmbed] });
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
