const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (message.partial) await message.fetch(); // In case the message is partial
        if (message.author.bot) return; // Ignore bot messages

        const logChannelId = await getLogChannel(message.guild.id, 'deleted_logs');

        if (logChannelId) {
            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Message Deleted')
                    .setDescription(`A message by ${message.author} was deleted.`)
                    .addFields(
                        { name: 'Content', value: message.content || 'No content (Embed/Attachment)' },
                        { name: 'Channel', value: `<#${message.channel.id}>` }
                    )
                    .setTimestamp()
                    .setFooter({ text: `Message ID: ${message.id}` });

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
