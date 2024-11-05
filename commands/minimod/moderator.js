const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'moderator',
    description: 'Provides information about the Moderator role.',
    async execute(message, args) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Moderator Role Information')
                .setDescription('Moderators are hand-picked by the owners. If you want to earn Moderator, you have to first earn MiniMod. Then, if you keep up the good work, you could be the next Moderator of the server!')
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
