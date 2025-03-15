require('dotenv').config();
const fs = require('fs');
const DiscordBot = require('./client/DiscordBot');
const EventsHandler = require("./client/handler/EventsHandler"); // Thêm dòng này

fs.writeFileSync('./terminal.log', '', 'utf-8');
const client = new DiscordBot();

new EventsHandler(client); // Thêm dòng này để tải sự kiện

module.exports = client;

client.connect();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
