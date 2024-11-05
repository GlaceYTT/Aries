const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'dog',
    description: 'Shows a random dog picture.',
    async execute(message, args) {
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');
        const dogUrl = response.data.message;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🐶 Here\'s a random dog')
            .setImage(dogUrl)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
