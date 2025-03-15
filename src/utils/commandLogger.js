const { InteractionResponseFlags } = require("discord.js");

async function logInteraction(interaction) {
    console.log(`🛠 [Command] ${interaction.user.tag} (ID: ${interaction.user.id}) đã sử dụng lệnh: /${interaction.commandName}`);
    console.log(`📍 [Location] Server: ${interaction.guild.name} | Kênh: #${interaction.channel.name}`);

    try {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: `🔍 Bạn đã sử dụng lệnh: \`/${interaction.commandName}\``, 
                flags: InteractionResponseFlags.Ephemeral 
            });
        } else {
            console.log("⚠ Interaction đã hết hạn, không thể gửi thông báo.");
        }
    } catch (err) {
        console.error(`❌ [Command Logger] Lỗi khi gửi thông báo: ${err.message}`);
    }
}

module.exports = { logInteraction };
