const { applicationCollection } = require('../database');

// Function to create a new application
async function createApplication(guildId, appName) {
    const application = {
        guildId, // Store guild ID for unique identification
        appName,
        questions: [],
        isActive: false,
        mainChannel: null,
        responseChannel: null,
    };

    await applicationCollection.insertOne(application);
}

// Function to add a question to an application
async function addQuestion(guildId, appName, question) {
    await applicationCollection.updateOne(
        { guildId, appName },
        { $push: { questions: question } }
    );
}

// Function to remove a question from an application
async function removeQuestion(guildId, appName, questionIndex) {
    const app = await applicationCollection.findOne({ guildId, appName });
    if (!app) return;

    app.questions.splice(questionIndex, 1);
    await applicationCollection.updateOne(
        { guildId, appName },
        { $set: { questions: app.questions } }
    );
}

// Function to delete an application
async function deleteApplication(guildId, appName) {
    await applicationCollection.deleteOne({ guildId, appName });
}

// Function to activate an application
async function activateApplication(guildId, appName, mainChannel, responseChannel) {
    await applicationCollection.updateOne(
        { guildId, appName },
        { $set: { isActive: true, mainChannel, responseChannel } }
    );
}

// Function to get an active application by guild ID
async function getActiveApplication(guildId) {
    return await applicationCollection.findOne({ guildId, isActive: true });
}
// Function to get an application by name
async function getApplication(guildId, appName) {
    return await applicationCollection.findOne({ guildId, appName });
}
module.exports = {
    createApplication,
    addQuestion,
    removeQuestion,
    deleteApplication,
    activateApplication,
    getActiveApplication,
    getApplication,
};
