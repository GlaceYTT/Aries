const { addQuestion, getApplication } = require('../../models/applications');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'addquestion',
    description: 'Add a question to an application',
    async execute(message, args) {
        const [appName, ...questionParts] = args;
        const question = questionParts.join(' ');

        if (!appName || !question) {
            const usageEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Usage')
                .setDescription('Usage: !addquestion <appName> <question>')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        const guildId = message.guild.id;
        const app = await getApplication(guildId, appName);

        if (!app) {
            const appNotFoundEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Not Found')
                .setDescription('Application not found.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [appNotFoundEmbed] });
        }

        await addQuestion(guildId, appName, question);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Question Added')
            .setDescription(`Question added to application **${appName}**.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [successEmbed] });
    },
};
