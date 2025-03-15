const { PermissionsBitField, TimeSpan } = require("discord.js");

// Biểu thức chính quy để phát hiện link
const linkRegex = /(https?:\/\/|www\.|discord\.gg)/gi;

// Danh sách role và kênh được phép gửi link
const allowedRoles = ["Moderator", "Admin"];
const allowedChannels = ["quang-cao", "link-share"];

// Cooldown cảnh báo (5 giây)
const cooldown = new Map();
const cooldownTime = 5000;

async function handleAntiLink(message) {
    if (!message.guild || message.author.id === message.client.user.id) return;

    // 🚫 Chặn tin nhắn từ Webhook
    if (message.webhookId) {
        try {
            await message.delete();
            console.log(`🚫 [Webhook] Đã xóa tin nhắn từ Webhook trong #${message.channel.name}`);
        } catch (err) {
            console.error(`❌ [Webhook] Lỗi khi xóa tin nhắn: ${err.message}`);
        }
        return;
    }

    // Nếu có role hoặc kênh được phép, bỏ qua
    if (message.member.roles.cache.some(role => allowedRoles.includes(role.name))) return;
    if (allowedChannels.includes(message.channel.name)) return;

    // 🚫 Kiểm tra tin nhắn có chứa link không
    if (linkRegex.test(message.content.toLowerCase())) {
        try {
            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            await message.delete();
            console.log(`🚫 [AntiLink] Người dùng: ${message.author.tag} (ID: ${message.author.id}) đã gửi link trong #${message.channel.name} (Server: ${message.guild.name}).`);

            // Chống spam cảnh báo
            if (cooldown.has(message.author.id)) return;
            cooldown.set(message.author.id, Date.now());
            setTimeout(() => cooldown.delete(message.author.id), cooldownTime);

            // Gửi cảnh báo
            const warningMessage = await message.channel.send({
                content: `🚫 <@${message.author.id}>, bạn không được phép gửi link! Bạn đã bị mute 24 tiếng.`,
                allowedMentions: { users: [message.author.id] }
            });
            setTimeout(() => warningMessage.delete(), 3000);

            // Mute người dùng 24 tiếng
            const muteDuration = 24 * 60 * 60 * 1000; // 24 giờ (milliseconds)
            await message.member.timeout(muteDuration, "Gửi link trái phép");
            console.log(`🔇 [Mute] ${message.author.tag} đã bị mute 24 tiếng.`);
        } catch (err) {
            console.error(`❌ [AntiLink] Lỗi khi xử lý tin nhắn chứa link: ${err.message}`);
        }
    }
}

module.exports = { handleAntiLink };
