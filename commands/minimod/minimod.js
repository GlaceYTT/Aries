const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'minimod',
    description: 'Provides information about the MiniMod role.',
    async execute(message, args) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('MiniMod Role Information')
                .setDescription('MiniMods are hand-picked by the owner. If you want to earn MiniMod, either apply or be active and respectful, and it could be you who’s the next MiniMod.')
                .setColor('#00FF00');

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
