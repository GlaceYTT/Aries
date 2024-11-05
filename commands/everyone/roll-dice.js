const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll-dice',
    description: 'Rolls a dice and returns a number between 1 and 6.',
    async execute(message) {
        try {
            const result = Math.floor(Math.random() * 6) + 1;

            const embed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setDescription(`${message.author} rolled a **${result}**.`)
                .setColor('#FFFF00');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
