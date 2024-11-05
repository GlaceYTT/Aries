const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
module.exports = {
    name: 'msg-history',
    description: 'Shows the last 20 messages of the mentioned user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return message.reply('You do not have permission to view message history.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to view their message history.');

            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = Array.from(messages.values())
                .filter(msg => msg.author.id === user.id)
                .slice(0, 20);

            const embed = new EmbedBuilder()
                .setColor('#00FFFF')
                .setTitle(`Last 20 Messages from ${user.tag}`)
                .setDescription(userMessages.map(m => `${m.createdAt.toLocaleString()}: ${m.content}`).join('\n') || 'No messages found.')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
