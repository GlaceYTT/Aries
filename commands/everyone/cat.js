const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'cat',
    description: 'Shows a random cat picture.',
    async execute(message, args) {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catUrl = response.data[0].url;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🐱 Here\'s a random cat')
            .setImage(catUrl)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
