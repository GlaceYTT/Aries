const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'delete',
    description: 'Deletes a message that the command replies to.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to delete messages.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const targetMessage = message.reference ? await message.channel.messages.fetch(message.reference.messageId) : null;
            if (!targetMessage) {
                const embed = new EmbedBuilder()
                    .setTitle('No Message Found')
                    .setDescription('Please reply to a message that you want to delete.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            await targetMessage.delete();

            const embed = new EmbedBuilder()
                .setTitle('Message Deleted')
                .setDescription(`Successfully deleted the message from ${targetMessage.author}.`)
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
