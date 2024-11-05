const { setTicketConfig } = require('../../models/ticketConfig');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setticket',
    description: 'Configure ticket channel and admin role for support tickets',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("You don't have permission to use this command.");
        }

        const channel = message.mentions.channels.first();
        const role = message.mentions.roles.first();

        if (!channel || !role) {
            return message.reply('Please mention both a channel and a role.');
        }

        await setTicketConfig(message.guild.id, channel.id, role.id);

        const ticketEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Support Tickets')
            .setDescription('Click the button below to create a ticket. Our team will assist you shortly.')
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Create Ticket')
                .setStyle(ButtonStyle.Primary)
        );

        await channel.send({ embeds: [ticketEmbed], components: [row] });
        message.reply(`Ticket system configured for channel <#${channel.id}> and role <@&${role.id}>.`);
    },
};
