const { PermissionsBitField } = require("discord.js");

// 🔥 Danh sách các từ tục và các biến thể (bạn có thể thêm vào)
const badWords = [
    "vcl", "cc", "fuck", "shit", "ngu",
    "biến-thể-1", "biến-thể-2", "biến-thể-3" // Thêm các biến thể khác nếu có
];

async function handleAntiBadWords(message) {
    if (!message.guild || message.author.bot) return;

    // 🔎 Kiểm tra xem tin nhắn có chứa từ tục không
    const messageContent = message.content.toLowerCase();
    if (badWords.some(word => messageContent.includes(word))) {
        try {
            // Nếu người gửi là admin, bỏ qua
            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            // ❌ Xóa tin nhắn
            await message.delete();
            console.log(`🚫 [AntiBadWords] Người dùng: ${message.author.tag} (ID: ${message.author.id}) đã gửi từ tục trong #${message.channel.name} (Server: ${message.guild.name}).`);

            // ⚠️ Gửi cảnh báo ngay trong kênh
            const warningMessage = await message.channel.send({
                content: `🚫 <@${message.author.id}>, vui lòng không sử dụng từ ngữ không phù hợp trong server này!`,
                allowedMentions: { users: [message.author.id] }
            });

            // ⏳ Xóa cảnh báo sau 3 giây
            setTimeout(() => warningMessage.delete(), 3000);
        } catch (err) {
            console.error(`❌ [AntiBadWords] Lỗi khi xử lý tin nhắn chứa từ tục: ${err.message}`);
        }
    }
}

module.exports = { handleAntiBadWords };
