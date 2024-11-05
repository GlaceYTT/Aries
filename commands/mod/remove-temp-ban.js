const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove-temp-ban',
    description: 'Removes a temporary ban from a user.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return message.reply('You do not have permission to unban members.');
            }

            const userId = args[0];
            if (!userId) return message.reply('Please provide a user ID to remove the temporary ban.');

            if (!/^\d+$/.test(userId)) return message.reply('Please provide a valid user ID.');

            const user = await message.client.users.fetch(userId).catch(() => null);
            if (!user) return message.reply('User not found.');

            await message.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Temporary Ban Removed')
                .setDescription(`${user.tag} (ID: ${userId}) has had their temporary ban removed.`)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
