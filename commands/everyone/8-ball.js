const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8-ball',
    description: 'Answers a yes/no question with a random response.',
    async execute(message, args) {
        try {
            const responses = [
                'Yes',
                'No',
                'Maybe',
                'Definitely',
                'Absolutely not',
                'I wouldn\'t count on it',
                'Certainly',
                'Ask again later',
                'I don\'t know'
            ];

            if (args.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please ask a question.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const result = responses[Math.floor(Math.random() * responses.length)];

            const embed = new EmbedBuilder()
                .setTitle('8-Ball Response')
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
