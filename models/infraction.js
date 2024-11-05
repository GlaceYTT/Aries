const { infractionsCollection } = require('../database');

async function createUserIfNotExists(userId) {
    const existingUser = await infractionsCollection.findOne({ userId });
    if (!existingUser) {
        const newUser = {
            userId,
            infractions: []
        };
        await infractionsCollection.insertOne(newUser);
    }
}

async function updateInfraction(userId, type, reason, moderator) {
    await createUserIfNotExists(userId);

    const user = await infractionsCollection.findOne({ userId });

    if (!user.infractions) {
        user.infractions = [];
    }

    const infractionsOfType = user.infractions.filter(infraction => infraction.type === type);
    const sequenceNumber = infractionsOfType.length + 1;

    const newInfraction = {
        type,
        reason,
        moderator,
        sequenceNumber,
        date: new Date(),
    };

    user.infractions.push(newInfraction);

    await infractionsCollection.updateOne(
        { userId },
        { $set: { infractions: user.infractions } }
    );
}



async function clearInfractions(userId, infractionType = null) {
    const user = await infractionsCollection.findOne({ userId });
    if (!user || !user.infractions) return;

    if (infractionType) {
        // Filter out the infractions of the specified type
        user.infractions = user.infractions.filter(infraction => infraction.type !== infractionType);
    } else {
        // Clear all infractions if no type is specified
        user.infractions = [];
    }

    await infractionsCollection.updateOne(
        { userId },
        { $set: { infractions: user.infractions } }
    );
}


async function getInfractions(userId) {
    const user = await infractionsCollection.findOne({ userId });
    return user?.infractions || [];
}


module.exports = {
    updateInfraction,
    clearInfractions,
    getInfractions,
};
