const { getTicketConfig, saveTicketChannel, clearTicketData } = require('../../models/ticketConfig');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { guild, user, customId } = interaction;
        const ticketConfig = await getTicketConfig(guild.id);

        if (!ticketConfig) {
            return interaction.reply({ content: 'Ticket system is not configured.', ephemeral: true });
        }

        const { roleId } = ticketConfig;

        if (customId === 'create_ticket') {
            // Check if a ticket channel already exists for the user
            const existingTicket = await saveTicketChannel(guild.id, user.id);
            if (existingTicket) {
                return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
            }

            // Create a new ticket channel for the user
            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}`,
                type: 0, // Text channel
                permissionOverwrites: [
                    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    { id: roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ],
            });

            // Save the ticket channel data
            await saveTicketChannel(guild.id, user.id, ticketChannel.id);

            // Embed for the ticket channel with "Close Ticket" and "Ping Admin" buttons
            const channelEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Support Ticket')
                .setDescription(`Hello <@${user.id}>, an admin will assist you shortly. Use the buttons below if needed.`)
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('ping_admin')
                    .setLabel('Ping Admin')
                    .setStyle(ButtonStyle.Primary)
            );

            await ticketChannel.send({ content: `<@${user.id}>`, embeds: [channelEmbed], components: [row] });

            // DM the user to confirm ticket creation
            const dmEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Ticket Created')
                .setDescription(`Your support ticket has been created in **${guild.name}**. Please wait, an admin will assist you shortly.`)
                .setTimestamp();

            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Could not send DM to ${user.tag}.`);
            }

            await interaction.reply({ content: 'Ticket created successfully.', ephemeral: true });
        } else if (customId === 'close_ticket') {
            // Close ticket by deleting the channel and clearing data
            await clearTicketData(guild.id, interaction.channel.id);
            await interaction.channel.delete();
        } else if (customId === 'ping_admin') {
            // Ping the admin role in the ticket channel
            await interaction.channel.send({ content: `<@&${roleId}>`, ephemeral: false });
        }
    },
};
