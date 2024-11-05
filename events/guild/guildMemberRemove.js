const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const logChannelId = await getLogChannel(member.guild.id, 'other_logs');

        if (logChannelId) {
            const logChannel = member.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Member Left')
                    .setDescription(`${member.user} has left the server.`)
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
