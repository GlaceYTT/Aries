const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');

module.exports = {
    name: 'promo',
    description: 'Times out a user for 15 minutes for promotional content, either by mention or by replying to their message.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to timeout members.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noPermsEmbed] });
            }

            let user;
            let member;

            if (message.reference) {
                const targetMessage = await message.channel.messages.fetch(message.reference.messageId);
                user = targetMessage.author;
                member = message.guild.members.resolve(user);

                if (!member) {
                    const userNotInGuildEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('That user isn\'t in this guild.')
                        .setColor('#FF0000');
                    return message.reply({ embeds: [userNotInGuildEmbed] });
                }

                const timeoutDuration = 15 * 60 * 1000; 
                await member.timeout(timeoutDuration, 'Posted promotional content');
                await targetMessage.delete();
                await updateInfraction(user.id, 'promoReply');
                
            } else {
                user = message.mentions.users.first();
                if (!user) {
                    const noMentionEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('Please mention a user to timeout.')
                        .setColor('#FF0000');
                    return message.reply({ embeds: [noMentionEmbed] });
                }

                member = message.guild.members.resolve(user);
                if (!member) {
                    const userNotInGuildEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('That user isn\'t in this guild.')
                        .setColor('#FF0000');
                    return message.reply({ embeds: [userNotInGuildEmbed] });
                }

                const timeoutDuration = 15 * 60 * 1000; 
                await member.timeout(timeoutDuration, 'Promotional content');
                await updateInfraction(user.id, 'promoMention');
            }

            const successEmbed = new EmbedBuilder()
                .setTitle('Timeout Issued')
                .setDescription(`${user} was issued a 15-minute timeout for:\n\`\`\`Posting Promotional content\`\`\``)
                .setColor('#00FF00');

            message.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
