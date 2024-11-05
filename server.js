// Require necessary modules
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const path = require('path');
require('dotenv').config();

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Express app setup
const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Event when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command handling (example for responding to a ping command)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

const cors = require('cors');

// Enable CORS
app.use(cors());

client.login(process.env.TOKEN);

