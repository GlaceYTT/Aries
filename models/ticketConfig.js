const { ticketConfigCollection } = require('../database');

// Function to set ticket configuration
async function setTicketConfig(guildId, channelId, roleId) {
    await ticketConfigCollection.updateOne(
        { guildId },
        { $set: { channelId, roleId, isEnabled: true } },
        { upsert: true }
    );
}

// Function to get ticket configuration
async function getTicketConfig(guildId) {
    return await ticketConfigCollection.findOne({ guildId, isEnabled: true });
}

// Save ticket channel ID for a user
async function saveTicketChannel(guildId, userId, channelId = null) {
    const existingTicket = await ticketConfigCollection.findOne({
        guildId,
        'tickets.userId': userId,
    });

    if (existingTicket) return existingTicket;

    await ticketConfigCollection.updateOne(
        { guildId },
        { $push: { tickets: { userId, channelId } } },
        { upsert: true }
    );
}

// Clear ticket data if a ticket is closed or channel is deleted
async function clearTicketData(guildId, channelId) {
    await ticketConfigCollection.updateOne(
        { guildId },
        { $pull: { tickets: { channelId } } }
    );
}

module.exports = {
    setTicketConfig,
    getTicketConfig,
    saveTicketChannel,
    clearTicketData,
};
