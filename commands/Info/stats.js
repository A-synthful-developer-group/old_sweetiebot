const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const packaged = require("../../package.json");
const packed = require("../../node_modules/klasa/package.json");
const pack = require("../../node_modules/discord.js/package.json");

module.exports = class StatCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "stats",
            aliases: ["stat"],
            cooldown: 2,
            description: (msg) => msg.language.get("COMMAND_STATS_DESCRIPTION"),
            usage: "",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        if(msg.channel.type === "dm" || msg.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .addField("Uptime:", uptime(process.uptime()), true)
                .addField("Current RAM usage:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
                .addField("Node.js Version:", process.version, true)
                .addField("SweetieBot Version:", `v${packaged.version}`, true)
                .addField("Discord.js Version:", `v${pack.version}`, true)
                .addField("Klasa Framework Version:", `v${packed.version}`, true)
                .addField("Discord.js Stats:", `Guilds: ${this.client.guilds.size}\t\tChannels: ${this.client.channels.size}\t\tUsers: ${this.client.users.size}`, true);
            return msg.send(`**Statistics about ${this.client.user.username}:**`, { embed });
        } else {
            msg.sendCode("asciidoc", msg.language.get("COMMAND_STATS", 
                this.client.user.username,
                uptime(process.uptime()),
                (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                process.version,
                packaged.version,
                pack.version,
                packed.version,
                this.client.users.size.toLocaleString(),
                this.client.guilds.size.toLocaleString(),
                this.client.channels.size.toLocaleString()));
        }
    }
};

function uptime(seconds) {
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    return (numdays + "d " + numhours + "h " + numminutes + "m");
}
