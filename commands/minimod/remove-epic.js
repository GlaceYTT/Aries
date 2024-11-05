const { removeEpic, getEpic } = require('../../models/epicData');
const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
module.exports = {
    name: 'remove-epic',
    description: 'Removes the Epic Games username for the mentioned user.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('You do not have permission to delete messages.');
        }

        // Check if a user was mentioned
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to remove their Epic Games name.');
        }

        // Check if the user has an Epic Games name set
        const epicName = await getEpic(user.id);
        if (!epicName) {
            return message.reply(`${user.username} does not have an Epic Games name set.`);
        }

        // Remove the Epic Games name from the database
        await removeEpic(user.id);

        // Create an embed to confirm the removal
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ Epic Games Name Removed')
            .setDescription(`${user.username}'s Epic Games name has been removed.`)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        // Send the confirmation message
        return message.channel.send({ embeds: [embed] });
    }
};
