const { MongoClient } = require('mongodb');
const config = require('./config');

const uri = config.mongodbUri;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('\x1b[36m[ DATABASE ]\x1b[0m', '\x1b[32mConnected to MongoDB ✅\x1b[0m');
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

const db = client.db('aries-bot'); 
const infractionsCollection = db.collection('infractions');
const logsCollection = db.collection('logs'); 
const usersCollection = db.collection('users'); 
const epicDataCollection = db.collection('epicData');
const customCommandsCollection = db.collection('customCommands');
const playlistsCollection = db.collection('playlists');
const economyCollection = db.collection('economy'); 
const birthdayCollection = db.collection('birthday'); 
const applicationCollection = db.collection('applications'); 
const reportsCollection = db.collection('reports'); 
const ticketConfigCollection = db.collection('ticketConfig');

module.exports = {
    connectToDatabase,
    infractionsCollection,
    logsCollection,
    usersCollection,
    epicDataCollection,
    customCommandsCollection,
    playlistsCollection,
    economyCollection,
    birthdayCollection,
    applicationCollection,
    reportsCollection,
    ticketConfigCollection,
};
