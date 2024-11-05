const { createApplication } = require('../../models/applications');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'createapp',
    description: 'Create a new application',
    async execute(message, args) {
        const appName = args.join(' ');

        if (!appName) {
            const noNameEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Creation Failed')
                .setDescription('Please provide a name for the application.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noNameEmbed] });
        }

        const guildId = message.guild.id;
        await createApplication(guildId, appName);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Application Created')
            .setDescription(`Application **${appName}** created successfully.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [successEmbed] });
    },
};
