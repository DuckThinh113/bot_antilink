const { Events } = require("discord.js");
const { logCommand } = require("../../utils/commandLogger");

module.exports = {
    __type__: 5,
    event: Events.InteractionCreate,
    once: false,

    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            await logCommand(interaction);
        }
    }
};
