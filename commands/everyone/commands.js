const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { version: discordJsVersion } = require('discord.js'); // Importing Discord.js version
const { version: nodeVersion } = process;

module.exports = {
    name: 'commands',
    description: 'Lists all available commands and bot info.',
    async execute(message, client) {
        const commands = loadCommands();

        if (commands.size === 0) {
            return message.reply('No commands are available.');
        }

        const totalMembers = message.guild.memberCount;
        const totalCommands = Array.from(commands.values()).reduce((acc, cmds) => acc + cmds.length, 0);
        const ping = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);

        const categoryData = Array.from(commands.entries()).map(([folder, cmds]) => ({
            name: folder,
            value: `${cmds.length} command(s)`,
            inline: true,
        }));

        const initialEmbed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: 'Total Members', value: `${totalMembers}`, inline: true },
                { name: 'Total Commands', value: `${totalCommands}`, inline: true },
                { name: 'Ping', value: `${ping}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Discord.js Version', value: `v${discordJsVersion}`, inline: true },
                { name: 'Node.js Version', value: `${nodeVersion}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                ...categoryData
            )
            .setDescription('Please select a category from the dropdown below to view its commands.')
            .setColor('FF00FF')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-folder')
            .setPlaceholder('Choose a command category')
            .addOptions(
                Array.from(commands.keys()).map(folder => ({
                    label: folder,
                    description: `Commands in the ${folder} category`,
                    value: folder,
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const initialMessage = await message.reply({
            embeds: [initialEmbed],
            components: [row],
        });

        const filter = (interaction) => interaction.isStringSelectMenu() && interaction.customId === 'select-folder' && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.deferred || interaction.replied) return; // Skip if already replied or deferred

            await interaction.deferReply({ ephemeral: true }); // Defer the interaction to prevent expiration

            const selectedFolder = interaction.values[0];
            const selectedCommands = commands.get(selectedFolder) || [];

            if (selectedCommands.length === 0) {
                await interaction.editReply({ content: 'No commands available in this category.' });
                return;
            }

            const embed = createEmbedForAllCommands(selectedFolder, selectedCommands);

            await interaction.editReply({
                embeds: [embed],
                components: [],
            });
        });

        collector.on('end', () => {
            if (!initialMessage.editable) return;
            initialMessage.edit({ components: [] });
        });
    },
};

function loadCommands() {
    const commands = new Map();
    const commandsPath = path.join(__dirname, '..');

    const folders = fs.readdirSync(commandsPath).filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

    folders.forEach(folder => {
        const folderPath = path.join(commandsPath, folder);

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        const folderCommands = [];

        files.forEach(file => {
            const command = require(path.join(folderPath, file));
            folderCommands.push({
                name: command.name,
                description: command.description || 'No description provided',
            });
        });

        if (folderCommands.length > 0) {
            commands.set(folder, folderCommands);
        }
    });

    return commands;
}

function createEmbedForAllCommands(folder, commands) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${folder} Commands`, iconURL: 'https://cdn.discordapp.com/avatars/1004206704994566164/54b01aefd6ded7e522735d1f8b81ef6f.webp' })
        .setColor('#FF00FF')
        .setDescription(commands.map(cmd => `**${cmd.name}** - ${cmd.description}`).join('\n'))
        .setFooter({ text: `Total Commands: ${commands.length}` });

    return embed;
}
