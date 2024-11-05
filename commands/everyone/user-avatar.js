const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'user-avatar',
    description: 'Show the avatar of the mentioned user.',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
