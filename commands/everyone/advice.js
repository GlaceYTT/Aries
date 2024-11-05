const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'advice',
    description: 'Gives a random piece of advice.',
    async execute(message, args) {
        const response = await axios.get('https://api.adviceslip.com/advice');
        const advice = response.data.slip.advice;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💡 Random Advice')
            .setDescription(advice)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.reply({ embeds: [embed] });
    }
};
