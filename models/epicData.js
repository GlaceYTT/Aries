const { epicDataCollection } = require('../database');

// Ensure a user's Epic Games data exists in the database
async function createEpicDataIfNotExists(userId) {
    const existingData = await epicDataCollection.findOne({ userId });
    if (!existingData) {
        const newEpicData = {
            userId,
            epic: null, // Placeholder for the Epic Games username
        };
        await epicDataCollection.insertOne(newEpicData);
    }
}

// Set the Epic Games username for a user
async function setEpic(userId, epic) {
    await createEpicDataIfNotExists(userId);
    await epicDataCollection.updateOne({ userId }, { $set: { epic } });
}

// Get the Epic Games username for a user
async function getEpic(userId) {
    const epicData = await epicDataCollection.findOne({ userId });
    return epicData ? epicData.epic : null;
}
async function removeEpic(userId) {
    await epicDataCollection.updateOne({ userId }, { $unset: { epic: "" } });
}

module.exports = {
    setEpic,
    getEpic,
    removeEpic,
};
