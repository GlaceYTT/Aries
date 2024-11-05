const { usersCollection } = require('../database');

// Create a new user document if it doesn't exist
async function createUserIfNotExists(userId) {
    const existingUser = await usersCollection.findOne({ userId });
    if (!existingUser) {
        const newUser = {
            userId,
            xp: 0,
            level: 1,
            weeklyXp: 0,
            backgroundUrl: null,
        };
        await usersCollection.insertOne(newUser);
    }
}

// Update XP and Level
async function updateXp(userId, xpAmount) {
    await createUserIfNotExists(userId);

    const user = await usersCollection.findOne({ userId });
    let newXp = user.xp + xpAmount;
    const newWeeklyXp = user.weeklyXp + xpAmount;
    const level = Math.floor(0.1 * Math.sqrt(newXp)); // Example XP to level formula

    // Ensure XP does not go below 0
    newXp = Math.max(newXp, 0);

    await usersCollection.updateOne(
        { userId },
        { $set: { xp: newXp, level, weeklyXp: newWeeklyXp } }
    );

    return { xp: newXp, level };
}


// Reset weekly XP (to be run periodically, e.g., with a cron job)
async function resetWeeklyXp() {
    await usersCollection.updateMany({}, { $set: { weeklyXp: 0 } });
}

// Get User Data
async function getUserData(userId) {
    return await usersCollection.findOne({ userId });
}

// Get Leaderboard Data
async function getLeaderboard(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await usersCollection.find().sort({ xp: -1 }).skip(skip).limit(limit).toArray();
}

// Set Rank Card Background
async function setRankCardBackground(userId, url) {
    await createUserIfNotExists(userId);
    await usersCollection.updateOne({ userId }, { $set: { backgroundUrl: url } });
}

module.exports = {
    updateXp,
    resetWeeklyXp,
    getUserData,
    getLeaderboard,
    setRankCardBackground,
};
