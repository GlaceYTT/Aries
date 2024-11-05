const { customCommandsCollection } = require('../database');

async function createOrUpdateCommand(userId, commandName, response) {
    // Check if the command already exists for the user
    const existingCommand = await customCommandsCollection.findOne({ userId, commandName });

    if (existingCommand) {
        // Update the existing command
        await customCommandsCollection.updateOne(
            { userId, commandName },
            { $set: { response } }
        );
    } else {
        // Insert a new command
        const newCommand = {
            userId,
            commandName,
            response,
        };
        await customCommandsCollection.insertOne(newCommand);
    }
}

async function getUserCommands(userId) {
    return await customCommandsCollection.find({ userId }).toArray();
}

async function deleteCommand(userId, commandName, isAdmin = false) {
    const query = isAdmin ? { commandName } : { userId, commandName };
    const result = await customCommandsCollection.deleteOne(query);
    return result.deletedCount > 0; // returns true if a command was deleted
}
module.exports = {
    createOrUpdateCommand,
    getUserCommands,
    deleteCommand,
};
