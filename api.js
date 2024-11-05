const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { ActivityType } = require('discord.js');
const { getCommandSettings, updateCommandSettings } = require('./config');  // Import from config.js
const app = express();
const port = process.env.PORT || 3000;

let botClient;

app.use(cors());
app.use(bodyParser.json());

// Inject the bot client instance
const setBotClient = (client) => {
    botClient = client;
};

// Endpoint to get bot stats
app.get('/api/bot/stats', (req, res) => {
    if (!botClient) return res.status(500).json({ error: 'Bot client not initialized' });

    const stats = {
        name: botClient.user.username,
        avatar: botClient.user.displayAvatarURL(),
        status: botClient.user.presence?.status || 'offline',
        activity: botClient.user.presence?.activities?.[0]?.name || 'None',
        servers: botClient.guilds.cache.size,
        members: botClient.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
        commands: botClient.commands.size,
    };

    res.json(stats);
});

// Endpoint to update bot activity and status
app.post('/api/bot/presence', (req, res) => {
    const { activity, status } = req.body;
    const activityData = activity
        ? {
            name: activity.name,
            type: ActivityType[activity.type.toUpperCase()] || ActivityType.Playing,
        }
        : null;

    botClient.setActivityAndStatus(activityData, status);
    res.json({ success: true });
});

// Endpoint to update bot avatar
app.post('/api/bot/avatar', async (req, res) => {
    const { avatarUrl } = req.body;
    if (!avatarUrl) return res.status(400).json({ error: 'Avatar URL is required' });

    try {
        const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        await botClient.user.setAvatar(buffer);
        res.json({ success: true, message: 'Avatar updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

// Endpoint to update bot banner
app.post('/api/bot/banner', async (req, res) => {
    const { bannerUrl } = req.body;
    if (!bannerUrl) return res.status(400).json({ error: 'Banner URL is required' });

    try {
        const response = await axios.get(bannerUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        await botClient.user.setBanner(buffer);
        res.json({ success: true, message: 'Banner updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update banner' });
    }
});

// Endpoint to send a message
app.post('/api/bot/send-message', async (req, res) => {
    const { channelId, message } = req.body;
    if (!channelId || !message) return res.status(400).json({ error: 'Channel ID and message are required' });

    const channel = botClient.channels.cache.get(channelId);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    try {
        await channel.send(message);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Endpoint to kick a user
app.post('/api/bot/kick-user', async (req, res) => {
    const { guildId, userId } = req.body;
    const guild = botClient.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: 'Guild not found' });

    try {
        const member = guild.members.cache.get(userId);
        if (member) await member.kick();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to kick user' });
    }
});

// Endpoint to timeout a user
app.post('/api/bot/timeout-user', async (req, res) => {
    const { guildId, userId, duration } = req.body;
    const guild = botClient.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: 'Guild not found' });

    try {
        const member = guild.members.cache.get(userId);
        if (member) await member.timeout(duration);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to timeout user' });
    }
});

// Endpoint to ban a user
app.post('/api/bot/ban-user', async (req, res) => {
    const { guildId, userId } = req.body;
    const guild = botClient.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: 'Guild not found' });

    try {
        const member = guild.members.cache.get(userId);
        if (member) await member.ban();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to ban user' });
    }
});

// Endpoint to get command settings
app.get('/api/bot/commands', (req, res) => {
    const commandSettings = getCommandSettings();
    res.json(commandSettings);
});

// Endpoint to update command settings
app.post('/api/bot/commands', (req, res) => {
    const { command, enabled } = req.body;
    const currentSettings = getCommandSettings();

    if (currentSettings.hasOwnProperty(command)) {
        currentSettings[command] = enabled;
        updateCommandSettings(currentSettings);
        res.json({ success: true, message: `Command ${command} has been ${enabled ? 'enabled' : 'disabled'}` });
    } else {
        res.status(400).json({ error: 'Invalid command name' });
    }
});

app.listen(port, () => {
    console.log(`API server is running on port ${port}`);
});

module.exports = { app, setBotClient };
