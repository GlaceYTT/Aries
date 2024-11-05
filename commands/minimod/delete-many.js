const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'delete-many',
    description: 'Deletes a specified number of messages from a mentioned user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to delete messages.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Missing User')
                    .setDescription('Please mention a user whose messages you want to delete.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const numberOfMessages = parseInt(args[1], 10);
            if (isNaN(numberOfMessages) || numberOfMessages <= 0) {
                const embed = new EmbedBuilder()
                    .setTitle('Invalid Number')
                    .setDescription('Please provide a valid number of messages to delete.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(msg => msg.author.id === user.id).first(numberOfMessages);

            if (userMessages.size === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('No Messages Found')
                    .setDescription('No messages found from the specified user.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            await Promise.all(userMessages.map(msg => msg.delete()));

            const embed = new EmbedBuilder()
                .setTitle('Messages Deleted')
                .setDescription(`Successfully deleted ${numberOfMessages} messages from ${user}.`)
                .setColor('#00FF00');

            message.channel.send({ embeds: [embed] });
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
