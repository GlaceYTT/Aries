const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'temp-timeout',
    description: 'Timeout the mentioned user for 5 minutes.',
    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === 'super trusted')) {
            return message.reply('You don\'t have permission to use this command.');
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply('Please mention a user to timeout.');

        await user.timeout(300000); 

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⏳ Temporary Timeout')
            .setDescription(`${user.user.tag} has been timed out for 5 minutes.`)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
