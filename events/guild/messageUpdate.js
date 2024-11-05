const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../models/logs');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (newMessage.partial) await newMessage.fetch();
        if (oldMessage.partial) await oldMessage.fetch();
        if (oldMessage.author.bot || oldMessage.content === newMessage.content) return; // Ignore bot and identical messages

        const logChannelId = await getLogChannel(newMessage.guild.id, 'edit_logs');

        if (logChannelId) {
            const logChannel = newMessage.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#FFFF00')
                    .setTitle('Message Edited')
                    .setDescription(`A message by ${newMessage.author} was edited.`)
                    .addFields(
                        { name: 'Before', value: oldMessage.content || 'No content (Embed/Attachment)' },
                        { name: 'After', value: newMessage.content || 'No content (Embed/Attachment)' },
                        { name: 'Channel', value: `<#${newMessage.channel.id}>` }
                    )
                    .setTimestamp()
                    .setFooter({ text: `Message ID: ${newMessage.id}` });

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
