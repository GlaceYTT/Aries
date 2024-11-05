const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'get-user-id',
    description: 'Fetches the User ID of the mentioned user.',
    execute(message, args) {
        try {
            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to get their ID.');

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('User ID')
                .setDescription(`The User ID of ${user} is **${user.id}**`)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
