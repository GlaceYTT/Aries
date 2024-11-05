const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'members',
    description: 'Shows the total number of members in the server.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return message.reply('You do not have permission to view the member count.');
            }

            const members = await message.guild.members.fetch();
            const memberCount = members.size;

            const embed = new EmbedBuilder()
                .setTitle('Member Count')
                .setDescription(`Total members: **${memberCount}**`)
                .setColor('#00FF00');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
