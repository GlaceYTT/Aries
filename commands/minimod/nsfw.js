const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');

module.exports = {
    name: 'nsfw',
    description: 'Times out a user for 30 minutes for posting NSFW content.',
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
            const timeoutDuration = 30 * 60 * 1000; 

            if (message.mentions.users.size > 0) {
                user = message.mentions.users.first();
                member = message.guild.members.resolve(user);

                if (!member) {
                    const userNotInGuildEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('That user isn\'t in this guild.')
                        .setColor('#FF0000');
                    return message.reply({ embeds: [userNotInGuildEmbed] });
                }

                await member.timeout(timeoutDuration, 'Posted NSFW content');
                await updateInfraction(user.id, 'nsfwMention');

            } else if (message.reference) {
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

                await member.timeout(timeoutDuration, 'Posted NSFW content');
                await targetMessage.delete(); 
                await updateInfraction(user.id, 'nsfwReply');
            } else {
                const noMentionOrReferenceEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please mention a user or reply to a message to timeout.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noMentionOrReferenceEmbed] });
            }

            const successEmbed = new EmbedBuilder()
                .setTitle('Timeout Successful')
                .setDescription(`${user} has been timed out for 30 minutes for:\n\`\`\`Posting NSFW content\`\`\``)
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
