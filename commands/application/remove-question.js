const { removeQuestion, getApplication } = require('../../models/applications');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removequestion',
    description: 'Remove a question from an application',
    async execute(message, args) {
        const [appName, questionIndex] = args;

        if (!appName || isNaN(questionIndex)) {
            const usageEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Usage')
                .setDescription('Usage: !removequestion <appName> <questionNumber>')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        const app = await getApplication(message.guild.id, appName);
        if (!app) {
            const appNotFoundEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Not Found')
                .setDescription('Application not found.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [appNotFoundEmbed] });
        }

        await removeQuestion(message.guild.id, appName, parseInt(questionIndex));

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Question Removed')
            .setDescription(`Question removed from application **${appName}**.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [successEmbed] });
    },
};
