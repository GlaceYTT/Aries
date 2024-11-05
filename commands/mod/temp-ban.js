const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'temp-ban',
    description: 'Temporarily bans a user for a specified duration with a reason.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return message.reply('You do not have permission to ban members.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to temporarily ban.');

            const member = message.guild.members.resolve(user);
            if (!member) return message.reply('That user isn\'t in this guild.');

            const duration = parseInt(args[1], 10);
            if (isNaN(duration) || duration <= 0) {
                return message.reply('Please provide a valid duration in days.');
            }

            const reason = args.slice(2).join(' ') || 'No reason provided';
            const banDuration = duration * 24 * 60 * 60 * 1000; 

            await member.ban({ reason });

            setTimeout(async () => {
                await message.guild.members.unban(user.id);
            }, banDuration);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Temporary Ban Issued')
                .setDescription(`${user.tag} has been temporarily banned for ${duration} days.`)
                .addFields({ name: 'Reason', value: reason })
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
