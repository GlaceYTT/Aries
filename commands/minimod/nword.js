const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { updateInfraction } = require('../../models/infraction');

module.exports = {
    name: 'nword',
    description: 'Bans a user for using the N-word.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have permission to ban members.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noPermsEmbed] });
            }

            let user;
            let member;

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

                await member.ban({ reason: 'Used N-word' });
                await updateInfraction(user.id, 'nwordMention');
                
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

                await member.ban({ reason: 'Used N-word' });
                await targetMessage.delete(); 
                await updateInfraction(user.id, 'nwordReply');
            } else {
                const noMentionOrReferenceEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please mention a user or reply to a message to ban.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [noMentionOrReferenceEmbed] });
            }

            const successEmbed = new EmbedBuilder()
                .setTitle('Ban Successful')
                .setDescription(`${user} has been banned for:\n\`\`\`Saying the N-word\`\`\``)
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
