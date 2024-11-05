const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');

module.exports = {
    name: 'bad-nsfw',
    description: 'Bans a user for posting bad NSFW content.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return message.reply('You do not have permission to ban members.');
            }

            let user = message.mentions.users.first();
            if (!user && message.reference) {
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                user = repliedMessage.author;
            }
            if (!user) return message.reply('Please mention a user or reply to a message from the user you want to ban.');

            const member = message.guild.members.resolve(user);
            if (!member) return message.reply('That user isn\'t in this guild.');

            const reason = 'Posted bad NSFW content';
            await member.ban({ reason });

            await updateInfraction(user.id, 'badWord');

            const embed = new EmbedBuilder()
                .setTitle('User Banned')
                .setDescription(`${user} has been banned for posting bad NSFW content.\n\n**Reason:** ${reason}`)
                .setColor('#FF0000');

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
