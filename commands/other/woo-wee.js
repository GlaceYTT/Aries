const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'woo-wee',
    description: 'Unlocks the server by restoring default permissions for the @everyone role.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return message.reply('You do not have permission to unlock the server.');
            }

            const everyoneRole = message.guild.roles.everyone;

           
            await Promise.all(message.guild.channels.cache.map(async channel => {
                await channel.permissionOverwrites.edit(everyoneRole, {
                    SendMessages: null,
                    AddReactions: null,
                });
            }));

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(`- ${message.author} has successfully unlocked the server.\n\n- We appreciate your cooperation in resolving the issue. Please remember to follow the server rules to ensure a positive experience for everyone.`)
                .setAuthor({ name: 'Server Unlocked', iconURL: 'https://cdn.discordapp.com/emojis/770663775971966976.gif' })
                .setFooter({ text: 'Follow the rules to avoid future actions.', iconURL: 'https://cdn.discordapp.com/emojis/1052709570558046308.gif' })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
