const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'coin-flip',
    description: 'Flips a coin and returns either heads or tails.',
    async execute(message) {
        try {
            const choices = ['heads', 'tails'];
            const result = choices[Math.floor(Math.random() * choices.length)];

            const embed = new EmbedBuilder()
                .setTitle('Coin Flip')
                .setDescription(`**${message.author.tag}:** ${result}`)
                .setColor('#00FF00');
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [embed] });
        }
    },
};
