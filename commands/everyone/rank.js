const { getUserData } = require('../../models/users');
const canvafy = require('canvafy');

module.exports = {
    name: 'rank',
    description: 'Show your rank card or the rank card of another user.',
    async execute(message, args) {
        try {
            const target = message.mentions.users.first() || message.author;
            const userData = await getUserData(target.id);

          
            const backgroundUrl = userData.backgroundUrl || 'https://cdn.discordapp.com/attachments/1278660524632047659/1278661372292628480/dark-anime-scenery-wot9wg412s7h8yxa.jpg?ex=66d59233&is=66d440b3&hm=64ffd8a4bd15d69d4ced607b9e7a12ca678161a6519469e4852ec781aa0de6e0&';

           
            const rankCard = await new canvafy.Rank()
                .setAvatar(target.displayAvatarURL({ forceStatic: true, extension: 'png' }))
                .setBackground('image', backgroundUrl)
                .setUsername(target.username)
                .setBorder('#fff')
                .setLevel(userData.level)
                .setRank(1) 
                .setCurrentXp(userData.xp)
                .setRequiredXp((userData.level + 1) ** 2 * 100) 
                .build();

        
            message.reply({
                files: [{
                    attachment: rankCard,
                    name: `rank-${target.id}.png`
                }]
            });
        } catch (error) {
            console.error("Error generating rank card:", error);
            message.reply('There was an error generating the rank card. Please try again later.');
        }
    }
};
