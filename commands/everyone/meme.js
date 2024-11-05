const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'meme',
    description: 'Posts a random meme.',
    async execute(message, args) {
        const apiUrl = 'https://www.reddit.com/r/memes/random/.json';

      
            const response = await axios.get(apiUrl);
            const [list] = response.data;
            const [post] = list.data.children;

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTitle(post.data.title)
                .setImage(post.data.url)
                .setURL(`https://reddit.com${post.data.permalink}`)
                .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` });
            

        return message.reply({ embeds: [embed] });

    }
};
