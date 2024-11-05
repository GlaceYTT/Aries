const { getLeaderboard } = require('../../models/users');
const canvafy = require('canvafy');

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top XP earners in the server.',
    async execute(message, args) {
        const page = parseInt(args[0]) || 1;
        const leaderboardData = await getLeaderboard(page);

        const usersData = leaderboardData.map((user, index) => ({
            top: (page - 1) * 10 + index + 1,
            avatar: message.guild.members.cache.get(user.userId).user.displayAvatarURL({ forceStatic: true, extension: 'png' }),
            tag: message.guild.members.cache.get(user.userId).user.tag,
            score: user.xp,
        }));

        const leaderboard = await new canvafy.Top()
            .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
            .setabbreviateNumber(false)
            .setBackground('image', 'https://cdn.discordapp.com/attachments/1278660524632047659/1278661805140611163/c88d29824806c6c4f8f70dc603d38045.png?ex=66d5929a&is=66d4411a&hm=91461635399c56f40ffa0117d90082a5c5fd869515d8ef5d53a28075b5a91b42&')
            .setUsersData(usersData)
            .build();

        message.reply({
            files: [{
                attachment: leaderboard,
                name: `leaderboard-page-${page}.png`
            }]
        });
    }
};
