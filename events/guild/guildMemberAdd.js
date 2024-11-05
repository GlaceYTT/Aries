const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const logChannelId = await getLogChannel(member.guild.id, 'other_logs');

        if (logChannelId) {
            const logChannel = member.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Member Joined')
                    .setDescription(`${member.user} has joined the server.`)
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
