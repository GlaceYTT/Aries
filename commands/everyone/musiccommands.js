const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'music-commands',
    description: 'Lists all music-related commands and their descriptions.',
    execute(message) {
        const commands = [
            { name: 'play', description: 'Play a song from a given URL or search query.' },
            { name: 'seek', description: 'Seek to a specific time in the currently playing song.' },
            { name: 'resume', description: 'Resume playback of the currently paused song.' },
            { name: 'pause', description: 'Pause the currently playing song.' },
            { name: 'stop', description: 'Stop the playback and clear the queue.' },
            { name: 'skip', description: 'Skip to the next song in the queue.' },
            { name: 'jump', description: 'Jump to a specific song in the queue.' },
            { name: 'loop', description: 'Toggle looping of the current song or queue.' },
            { name: 'queue', description: 'Show the current song queue.' },
            { name: 'remove', description: 'Remove a specific song from the queue.' },
            { name: 'shuffle', description: 'Shuffle the songs in the queue.' },
            { name: 'clear', description: 'Clear the song queue.' },
            { name: 'craete-playlist', description: 'create your own playlist' },
            { name: 'show-playlists', description: 'shows your created playlists.' },
            { name: 'add-song', description: 'adds song to your playlist' },
            { name: 'delete-playlist', description: 'delete the playlist by name.' },
            { name: 'remove-song', description: 'remove song from you playlist.' },
            { name: 'play-playlist', description: 'plays your custom created playlist.' },
            { name: 'show-songs', description: 'view your playlist songs' },

        ];

        const embed = new EmbedBuilder()
            .setTitle('Music Commands')
            .setDescription('Here are the available music commands:')
            .setColor('#0099ff') 
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        commands.forEach(command => {
            embed.addFields( { name :`**${command.name}**`, value : command.description, inline : false} );
        });

        message.reply({ embeds: [embed] });
    }
};
