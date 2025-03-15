const { info, error, success } = require('../../utils/Console');
const { readdirSync } = require('fs');
const DiscordBot = require('../DiscordBot');
const Component = require('../../structure/Component');
const AutocompleteComponent = require('../../structure/AutocompleteComponent');
const Event = require('../../structure/Event');

class EventsHandler {
    client;

    /**
     * @param {DiscordBot} client 
     */
    constructor(client) {
        this.client = client;
    }

    load = () => {
        let total = 0;

        for (const directory of readdirSync('./src/events/')) {
            for (const file of readdirSync(`./src/events/${directory}`).filter((f) => f.endsWith('.js'))) {
                try {
                    /**
                     * @type {Event['data']}
                     */
                    const modulePath = `../../events/${directory}/${file}`;
                    const module = require(modulePath);

                    if (!module) {
                        error(`⚠ Không thể tải sự kiện ${file} (Module rỗng)`);
                        continue;
                    }

                    if (module.__type__ === 5) {
                        if (!module.event || !module.run) {
                            error(`⚠ Không thể tải sự kiện ${file} (Thiếu event hoặc run)`);
                            continue;
                        }

                        if (module.once) {
                            this.client.once(module.event, (...args) => module.run(this.client, ...args));
                        } else {
                            this.client.on(module.event, (...args) => module.run(this.client, ...args));
                        }

                        info(`✅ Đã tải sự kiện: ${file}`);
                        total++;
                    } else {
                        error(`❌ Loại sự kiện không hợp lệ (${module.__type__}) trong file ${file}`);
                    }
                } catch (err) {
                    error(`❌ Lỗi khi tải sự kiện ${file}: ${err.message}`);
                }
            }
        }

        success(`🎉 Đã tải thành công ${total} sự kiện.`);
    }
}

module.exports = EventsHandler;
