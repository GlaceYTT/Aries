const { logsCollection } = require('../database');

// Function to create a default server log entry if it doesn't exist
async function createLogEntryIfNotExists(serverId) {
    const existingEntry = await logsCollection.findOne({ serverId });
    if (!existingEntry) {
        const newEntry = {
            serverId,
            ban_logs: null,
            timeout_logs: null,
            deleted_logs: null,
            edit_logs: null,
            kick_logs: null,
            warn_logs: null,
            fortnite_logs: null,
            role_logs: null,
            other_logs: null,
            level_logs: null, // Add level_logs to the log entry
        };
        await logsCollection.insertOne(newEntry);
    }
}

// Function to update a specific log category with a channel ID
async function updateLogChannel(serverId, category, channelId) {
    await createLogEntryIfNotExists(serverId);
    const update = { $set: { [category]: channelId } };
    await logsCollection.updateOne({ serverId }, update);
}

// Function to retrieve a specific log category's channel ID
async function getLogChannel(serverId, category) {
    const logEntry = await logsCollection.findOne({ serverId });
    return logEntry ? logEntry[category] : null;
}

// Function to retrieve all log channels for a server
async function getAllLogChannels(serverId) {
    const logEntry = await logsCollection.findOne({ serverId });
    return logEntry || null;
}

module.exports = {
    createLogEntryIfNotExists,
    updateLogChannel,
    getLogChannel,
    getAllLogChannels,
};
