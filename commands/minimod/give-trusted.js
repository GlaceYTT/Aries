const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'give-trusted',
    description: 'Gives the trusted role to the mentioned user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to manage roles.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Missing User')
                    .setDescription('Please mention a user to give the trusted role.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const member = message.guild.members.resolve(user);
            if (!member) {
                const embed = new EmbedBuilder()
                    .setTitle('User Not Found')
                    .setDescription('That user isn\'t in this guild.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const trustedRole = message.guild.roles.cache.find(role => role.name === 'Trusted');
            if (!trustedRole) {
                const embed = new EmbedBuilder()
                    .setTitle('Role Not Found')
                    .setDescription('Trusted role not found.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            await member.roles.add(trustedRole);

            const embed = new EmbedBuilder()
                .setTitle('Role Assigned')
                .setDescription(`${message.author} successfully gave the Trusted role to ${user}.`)
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
