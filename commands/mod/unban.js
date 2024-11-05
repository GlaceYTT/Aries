const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unbans a user by their user ID.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return message.reply('You do not have permission to unban members.');
            }

            const userId = args[0];
            if (!userId) return message.reply('Please provide a user ID to unban.');

            if (!/^\d+$/.test(userId)) return message.reply('Please provide a valid user ID.');

            try {
                await message.guild.members.unban(userId);

                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('User Unbanned')
                    .setDescription(`User ID ${userId} has been unbanned.`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp();

                message.reply({ embeds: [embed] });
            } catch (error) {
                message.reply('Could not unban the user. Make sure the ID is correct.');
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
