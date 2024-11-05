const { Client, Collection, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { printWatermark } = require('./events/client/pw');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
      return GatewayIntentBits[a];
    }),
  });

  const { commandSettings } = require('./config');

  client.commands = new Collection();
  
  const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
  
  //console.log('Command Folders:', commandFolders);
  //console.log('Command Settings:', commandSettings);
  
  for (const folder of commandFolders) {
      //console.log(`Processing folder: ${folder}`);
  
      if (!commandSettings[folder]) {
          //console.log(`Commands in the ${folder} folder are turned off.`);
          continue;
      }
  
      const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder))
          .filter(file => file.endsWith('.js'));
  
      //console.log(`Loading commands from folder: ${folder}`);
  
      for (const file of commandFiles) {
          //console.log(`Loading command file: ${file}`);
          const command = require(path.join(__dirname, 'commands', folder, file));
          client.commands.set(command.name, command);
      }
  }

const eventFolders = fs.readdirSync(path.join(__dirname, 'events'));
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events', folder)).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(path.join(__dirname, 'events', folder, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}
const { connectToDatabase } = require('./database');

connectToDatabase().then(() => {
    console.log('\x1b[35m[ DATABASE ]\x1b[0m', '\x1b[32mMongoDB Online ✅\x1b[0m');
}).catch(console.error);

client.login(process.env.TOKEN).then(() => {
    console.log('\x1b[31m[ CORE ]\x1b[0m', '\x1b[32mBot Logged In Sucessfully ✅\x1b[0m');
}).catch(console.error);
printWatermark();

const { getActiveApplication } = require('./models/applications'); 

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'open_application_modal') {
        const app = await getActiveApplication(interaction.guild.id);
        if (!app) return interaction.reply({ content: 'Active application not found for this server.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId('application_form')
            .setTitle('Application Form');

        app.questions.forEach((question, index) => {
            const textInput = new TextInputBuilder()
                .setCustomId(`question_${index}`)
                .setLabel(question)
                .setStyle(TextInputStyle.Short);

            modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        });

        await interaction.showModal(modal);
    } else if (interaction.isModalSubmit() && interaction.customId === 'application_form') {
        const app = await getActiveApplication(interaction.guild.id);
        if (!app) return interaction.reply({ content: 'Active application not found for this server.', ephemeral: true });

        const answers = app.questions.map((_, index) => interaction.fields.getTextInputValue(`question_${index}`));
        const responseChannel = interaction.guild.channels.cache.get(app.responseChannel);

        if (!responseChannel) {
            return interaction.reply({ content: 'Response channel not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('New Application Submission')
            .setDescription(answers.map((answer, index) => `**Q${index + 1}**: ${answer}`).join('\n'))
            .setColor('Blue')
            .setFooter({ text: `Submitted by: ${interaction.user.id}` });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('accept_application').setLabel('Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('deny_application').setLabel('Deny').setStyle(ButtonStyle.Danger)
        );

        await responseChannel.send({ embeds: [embed], components: [buttons] });
        interaction.reply({ content: 'Your application has been submitted!', ephemeral: true });
    } else if (interaction.isButton() && (interaction.customId === 'accept_application' || interaction.customId === 'deny_application')) {
       
        await interaction.deferReply({ ephemeral: true });

        const embed = interaction.message.embeds[0];
        const userId = embed.footer?.text.split('Submitted by: ')[1]; 

        if (!userId) {
            return interaction.followUp({ content: 'Could not find the user who submitted the application.', ephemeral: true });
        }

        const status = interaction.customId === 'accept_application' ? 'accepted' : 'denied';
        const color = status === 'accepted' ? 'Green' : 'Red';

  
        const updatedEmbed = EmbedBuilder.from(embed)
            .setColor(color);

        await interaction.editReply({ embeds: [updatedEmbed], components: [] });

        try {
            const user = await interaction.guild.members.fetch(userId);
            const dmEmbed = new EmbedBuilder()
                .setTitle(`Your Application Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`)
                .setDescription(`Your application to **${interaction.guild.name}** has been **${status}**.`)
                .addFields(
                    { name: 'Decision Time', value: new Date().toLocaleString(), inline: true },
                    { name: 'Status', value: status.charAt(0).toUpperCase() + status.slice(1), inline: true }
                )
                .setColor(color);

            await user.send({ embeds: [dmEmbed] });
            interaction.followUp({ content: `The user has been notified that their application was ${status}.`, ephemeral: true });
        } catch (error) {
            interaction.followUp({ content: `Failed to send a DM to the user.`, ephemeral: true });
        }
    }
});

const cron = require('node-cron');
const { getEconomyProfile, updateBills, handleEviction, updateWallet } = require('./models/economy');



async function checkAndProcessBills() {
    const allProfiles = await economyCollection.find({}).toArray();

    for (const profile of allProfiles) {
        const userId = profile.userId;
        const user = await client.users.fetch(userId);
        
        const now = Date.now();
        const overdueRent = profile.bills.unpaidRent > 0 && now > profile.bills.rentDueDate;
        const overdueUtilities = profile.bills.unpaidUtilities > 0 && now > profile.bills.utilitiesDueDate;

    
        const totalOverdue = overdueRent ? profile.bills.unpaidRent : 0;
        if (overdueRent || overdueUtilities) {
           
            const embed = new EmbedBuilder()
                .setTitle('Overdue Bills Warning')
                .setDescription(`You have overdue bills. Total Due: $${totalOverdue}. Please pay to avoid eviction.`)
                .setColor('#FFA500');
            user.send({ embeds: [embed] });

            if (now - profile.bills.rentDueDate > 7 * 24 * 60 * 60 * 1000) { 
              
                if (profile.wallet >= totalOverdue) {
                    await updateWallet(userId, -totalOverdue);
                    await updateBills(userId, { unpaidRent: 0, rentDueDate: now + 30 * 24 * 60 * 60 * 1000 });
                    
                    const paymentEmbed = new EmbedBuilder()
                        .setTitle('Bills Paid Automatically')
                        .setDescription(`We have deducted $${totalOverdue} from your wallet to cover overdue bills.`)
                        .setColor('#00FF00');
                    user.send({ embeds: [paymentEmbed] });
                } else {
                    // Handle eviction if user cannot pay
                    await handleEviction(userId);
                    const evictionEmbed = new EmbedBuilder()
                        .setTitle('Eviction Notice')
                        .setDescription('You have been evicted due to unpaid bills.')
                        .setColor('#FF0000');
                    user.send({ embeds: [evictionEmbed] });
                }
            }
        }
    }
}


cron.schedule('0 0 * * *', () => {
    console.log('Running daily bill check...');
    checkAndProcessBills();
});


const { setBotClient } = require('./api');
setBotClient(client);  

module.exports = client;