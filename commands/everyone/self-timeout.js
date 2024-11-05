const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'self-timeout',
    description: 'Times out yourself for 30 seconds.',
    async execute(message) {
        try {
            const timeoutDuration = 30 * 1000;

            const member = message.guild.members.resolve(message.author);
            if (!member) return message.reply('You are not a member of this guild.');

            await member.timeout(timeoutDuration, `Timed out by ${message.author} for 30 seconds`);

            const embed = new EmbedBuilder()
                .setTitle('Self Timeout')
                .setDescription(`${message.author} has timed themself out for 30 seconds.`)
                .setColor('#FF0000');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
