const { updateXp } = require('../../models/users');
const { getLogChannel } = require('../../models/logs');
const { getUserCommands } = require('../../models/customCommands'); // Import custom commands model
const canvafy = require('canvafy'); // Make sure to require the canvafy package

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

       
        if (message.content.startsWith('!')) {
            const args = message.content.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

           
            const command = client.commands.get(commandName);

            if (command) {
                try {
                    await command.execute(message, args);
                } catch (error) {
                    console.error(error);
                    message.reply('There was an error trying to execute that command!');
                }
                return; 
            }

            
            const customCommands = await getUserCommands(message.author.id);
            const customCommand = customCommands.find(cmd => cmd.commandName === commandName);

            if (customCommand) {
                try {
                    // Execute the custom command by sending the stored response
                    message.reply(customCommand.response);
                } catch (error) {
                    console.error(error);
                    message.reply('There was an error trying to execute your custom command!');
                }
                return; // Exit early if it's a custom command
            }
        }

        // XP System Logic
        let xpGain = 10; // Base XP for sending a message

        // Check for images (attachments)
        if (message.attachments.size > 0) {
            xpGain += 5; // Extra XP for images
        }

     
        if (/(https?:\/\/[^\s]+)/g.test(message.content)) {
            xpGain += 5; 
        }

   
        const { xp, level } = await updateXp(message.author.id, xpGain);

      
        const oldLevel = Math.floor(0.1 * Math.sqrt(xp - xpGain));
        if (level > oldLevel) {
            const logChannelId = await getLogChannel(message.guild.id, 'level_logs');
            const levelUpMessage = `${message.author}, you leveled up to **level ${level}!** 🎉`;

         
            const levelUpCard = await new canvafy.LevelUp()
                .setAvatar(message.author.displayAvatarURL({ format: 'png', size: 1024 }))
                .setBackground("image", "https://cdn.discordapp.com/attachments/1278660524632047659/1278663792489922581/anime-anime-girls-playing-cards-red-eyes-hd-wallpaper-preview.jpg?ex=66d19ff4&is=66d04e74&hm=c30f959d2e17509fb8f01c99b1fb42d4f32beb46be81ba5d12791c99306530a9&")
                .setUsername(message.author.username, "#ffffff")
                .setBorder("#000000")
                .setAvatarBorder("#ff0000")
                .setOverlayOpacity(0.7)
                .setLevels(oldLevel, level)
                .build();

       
            const attachment = {
                attachment: levelUpCard,
                name: `levelup-${message.author.id}.png`
            };

            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ content: levelUpMessage, files: [attachment] });
                }
            } else {
                message.channel.send({ content: levelUpMessage, files: [attachment] });
            }
        }
    },
};
