const { playlistsCollection } = require('../database');

// Create a new playlist
async function createPlaylist(userId, playlistName) {
    const existingPlaylist = await playlistsCollection.findOne({ userId, playlistName });
    if (existingPlaylist) {
        throw new Error('Playlist already exists.');
    }
    const newPlaylist = {
        userId,
        playlistName,
        songs: [], // Initialize with an empty song list
    };
    await playlistsCollection.insertOne(newPlaylist);
}

// Add a song to a playlist
async function addSongToPlaylist(userId, playlistName, song) {
    await playlistsCollection.updateOne(
        { userId, playlistName },
        { $push: { songs: song } }
    );
}

// Remove a song from a playlist
async function removeSongFromPlaylist(userId, playlistName, song) {
    await playlistsCollection.updateOne(
        { userId, playlistName },
        { $pull: { songs: song } }
    );
}

// Delete a playlist
async function deletePlaylist(userId, playlistName) {
    await playlistsCollection.deleteOne({ userId, playlistName });
}

// Get songs from a playlist
async function getPlaylistSongs(userId, playlistName) {
    const playlist = await playlistsCollection.findOne({ userId, playlistName });
    return playlist ? playlist.songs : null;
}

// Get a list of playlists for a user
async function getUserPlaylists(userId) {
    const playlists = await playlistsCollection.find({ userId }).toArray();
    return playlists.map(playlist => playlist.playlistName);
}

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    getPlaylistSongs,
    getUserPlaylists,
};
