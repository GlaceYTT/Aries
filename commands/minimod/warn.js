const { updateInfraction } = require('../../models/infraction');
const { getLogChannel } = require('../../models/logs');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Warns a user and logs the infraction.',
    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return message.reply('You do not have permission to warn members.');
            }

            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to warn.');

            const reason = args.slice(1).join(' ') || 'No reason provided';
            const moderator = message.author.tag;
            const serverName = message.guild.name;
          
            await updateInfraction(user.id, 'warn', reason, moderator);

           
            const dmEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Warn Issued', iconURL: 'https://cdn.discordapp.com/emojis/902462997115572254.gif' })
                .setDescription(`You have been warned by ${message.author.tag}`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: moderator }
                )
                .setColor('Yellow')
                .setTimestamp();

           
            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error(`Could not send DM to ${user.tag}: ${error}`);
            }

           
           
            const serverEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Warn Issued', iconURL: 'https://cdn.discordapp.com/emojis/902462997115572254.gif' })
                .setFooter({ text: 'Continued violations may lead to severe actions.', iconURL: 'https://cdn.discordapp.com/emojis/805980519644004372.gif' })
                .setDescription(` ${user} has been Warned by ${message.author}\n- **Reason:** ${reason}\n- **Time:** ${new Date().toLocaleString()}\n- **Server Name :** ${serverName}`)
                .setColor('Yellow');

          
            await message.reply({ embeds: [serverEmbed] });

       
            const logEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Warn Issued', iconURL: 'https://cdn.discordapp.com/emojis/902462997115572254.gif' })
                .setDescription(`**User Warned:** ${user.tag}\n**Moderator:** ${moderator}\n**Reason:** ${reason}`)
                .setColor('Yellow')
                .setTimestamp();

         
            const logChannelId = await getLogChannel(message.guild.id, 'warn_logs');
            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [logEmbed] });
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found in guild.`);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
