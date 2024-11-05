const { EmbedBuilder } = require('discord.js');
const { getInfractions } = require('../../models/infraction');

module.exports = {
    name: 'infractions',
    description: 'Shows the infractions for a user.',
    async execute(message, args) {
        try {
            const user = message.mentions.users.first();
            if (!user) return message.reply('Please mention a user to view their infractions.');

            const infractions = await getInfractions(user.id);
            if (infractions.length === 0) {
                return message.reply('No infractions found for this user.');
            }

            // Categorize infractions
            const warnings = infractions.filter(i => i.type === 'warn');
            const bans = infractions.filter(i => i.type === 'ban');
            const timeouts = infractions.filter(i => i.type === 'timeout');

            // Create embed
            const embed = new EmbedBuilder()
            .setAuthor({ name: 'Infractions', iconURL: 'https://cdn.discordapp.com/emojis/974290321972273212.gif' })
            .setFooter({ text: 'Review the server rules to avoid further warnings.', iconURL: 'https://cdn.discordapp.com/emojis/825620203824087110.gif' })
            
                .setDescription(`- **${user}'s Infractions list :**`)
                .setColor('Blurple')
                .setTimestamp();

            // Add warnings
            if (warnings.length > 0) {
                let warningList = warnings.map(w => `#${w.sequenceNumber} - ${w.reason} | ${w.moderator} | ${w.date.toDateString()}`).join('\n');
                embed.addFields({ name: 'Warnings', value: `\`\`\`${warningList}\`\`\``, inline: false });
            }

            // Add bans
            if (bans.length > 0) {
                let banList = bans.map(b => `#${b.sequenceNumber} - ${b.reason} | ${b.moderator} | ${b.date.toDateString()}`).join('\n');
                embed.addFields({ name: 'Bans', value: `\`\`\`${banList}\`\`\``, inline: false });
            }

            // Add timeouts
            if (timeouts.length > 0) {
                let timeoutList = timeouts.map(t => `#${t.sequenceNumber} - ${t.reason} | ${t.moderator} | ${t.date.toDateString()}`).join('\n');
                embed.addFields({ name: 'Timeouts', value: `\`\`\`${timeoutList}\`\`\``, inline: false });
            }

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};
