const { EmbedBuilder } = require('discord.js');
const { setRankCardBackground } = require('../../models/users');

module.exports = {
    name: 'set-banner-background',
    description: 'Sets the background for your rank card.',
    async execute(message, args) {
        const url = args[0];
        if (!url) {
            const embed = new EmbedBuilder()
                .setTitle('Invalid URL')
                .setDescription('Please provide a valid image URL.')
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] });
        }

        await setRankCardBackground(message.author.id, url);

        const embed = new EmbedBuilder()
            .setTitle('Background Updated')
            .setDescription('Your rank card background has been updated!')
            .setColor('#00FF00');

        return message.reply({ embeds: [embed] });
    },
};
