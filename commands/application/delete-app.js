const { deleteApplication } = require('../../models/applications');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deleteapp',
    description: 'Delete an application',
    async execute(message, args) {
        const appName = args.join(' ');

        if (!appName) {
            const noNameEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Deletion Failed')
                .setDescription('Please provide the name of the application to delete.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noNameEmbed] });
        }

        await deleteApplication(appName);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Application Deleted')
            .setDescription(`Application **${appName}** deleted successfully.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [successEmbed] });
    },
};
