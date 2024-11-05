const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'wee-woo',
    description: 'Locks down the server by restricting permissions for the @everyone role.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to lock down the server.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const everyoneRole = message.guild.roles.everyone;

            await Promise.all(message.guild.channels.cache.map(async channel => {
                await channel.permissionOverwrites.edit(everyoneRole, {
                    SendMessages: false,
                    AddReactions: false,
                });
            }));

            const embed = new EmbedBuilder()
           
                .setDescription(`- ${message.author} has locked the server due to a violation of the rules.\n\n- Access is currently restricted to prevent further issues. Please adhere to the server guidelines to avoid future restrictions. If you believe this action was taken in error, contact a server admin.`)
                .setAuthor({ name: 'Server locked', iconURL: 'https://cdn.discordapp.com/emojis/915892891870691378.gif' })
                .setFooter({ text: 'Follow the rules to avoid future actions.', iconURL: 'https://cdn.discordapp.com/emojis/1052709570558046308.gif' })
                .setColor('#00FF00')
                 .setTimestamp();

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
