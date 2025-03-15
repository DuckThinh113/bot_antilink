const { PermissionsBitField } = require("discord.js");
const userMessages = new Map();
const cooldowns = new Map(); // Cooldown cảnh báo
const cooldownTime = 10000; // 10 giây cooldown

async function handleAntiSpam(message) {
    if (!message.guild || message.author.bot) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!userMessages.has(userId)) {
        userMessages.set(userId, { timestamps: [] });
    }

    const userData = userMessages.get(userId);
    userData.timestamps.push(now);

    // Chỉ giữ lại các tin nhắn trong vòng 5 giây gần nhất
    userData.timestamps = userData.timestamps.filter(ts => ts > now - 5000);

    // Nếu spam từ 3 tin trong 5 giây => Xóa tất cả tin nhắn spam của người dùng
    if (userData.timestamps.length >= 3) {
        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessagesToDelete = messages.filter(m => m.author.id === userId && m.createdTimestamp >= (now - 5000));

            if (userMessagesToDelete.size > 0) {
                await message.channel.bulkDelete(userMessagesToDelete, true);

                // Kiểm tra cooldown trước khi gửi cảnh báo
                if (!cooldowns.has(userId)) {
                    cooldowns.set(userId, now);

                    // Gửi cảnh báo
                    const warningMessage = await message.channel.send({
                        content: `🚫 <@${userId}>, bạn đã gửi tin nhắn quá nhanh! Vui lòng không spam. Bạn đã bị mute 10 phút!`,
                        allowedMentions: { users: [userId] }
                    });
                    setTimeout(() => warningMessage.delete(), 3000);

                    // Mute người dùng trong 10 phút
                    await message.member.timeout(10 * 60 * 1000, "Spam tin nhắn");
                    console.log(`🔇 [AntiSpam] Đã mute ${message.author.tag} trong 10 phút do spam.`);
                }
            }
        } catch (err) {
            console.error(`❌ [AntiSpam] Lỗi khi xóa tin nhắn spam: ${err.message}`);
        }
    }

    // Xóa dữ liệu user sau 10 giây nếu không có tin nhắn mới
    setTimeout(() => {
        if (userMessages.has(userId) && userMessages.get(userId).timestamps[0] < now - 10000) {
            userMessages.delete(userId);
        }
        cooldowns.delete(userId); // Reset cooldown
    }, cooldownTime);
}

module.exports = { handleAntiSpam };
