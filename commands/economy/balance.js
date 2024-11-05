// commands/economy/balance.js
const { getEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'balance',
    aliases: ['bal'],
    description: 'Check your balance.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        // Explicitly cast wallet and bank to numbers with fallback to default values
        const wallet = Number(profile.wallet ?? 1);  // Default to 1 if undefined or NaN
        const bank = Number(profile.bank ?? 0);      // Default to 0 if undefined or NaN

        const embed = new EmbedBuilder()
            .setTitle('Balance')
            .setDescription(`**Wallet:** $${wallet}\n**Bank:** $${bank}`)
            .setColor('#FF00FF')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
