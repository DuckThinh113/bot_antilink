const { Events } = require("discord.js");
const { handleAntiLink } = require("../../utils/antiLink");
const { handleAntiSpam } = require("../../utils/antiSpam");
const { handleAntiBadWords } = require("../../utils/antiBadWords");


module.exports = {
    __type__: 5,
    event: Events.MessageCreate,
    once: false,

    run: async (client, message) => {
        if (!message.guild || message.author.id === client.user.id) return;

        await handleAntiLink(message);  // Kiểm tra link 
        await handleAntiSpam(message);  // Kiểm tra spam
        await handleAntiBadWords(message); // Kiểm tra từ cấm
    }
};
