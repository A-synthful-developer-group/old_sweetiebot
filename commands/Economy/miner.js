const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["mine", "miner-stats", "miner-info", "mine-stats", "miner-info"],
            description: "Tells you your current miner stats.",
            cooldown: 2,
            usage: "[User:user]",
            extendedHelp: "No extended help available.",
            enabled: false
        });
    }
    async run(msg, [text]) {
        if (text) {
            const info = this.client.economyMap.get(text.id);
            if(info) {
                const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
                const embed = new MessageEmbed()
                    .setTitle(`This are the current stats of ${text.username}'s miner`)
                    .setColor(0xB537B1)
                    .addField("\nLevel:", info.miner, true)
                    .addField("tH/s:\t", `${(info.miner*1.28)}tH/s`, true)
                    .addField("Satoshi/h:", `${Math.floor(body.coins_per_hour/0.00000001)} Satoshi/h`)
                    .addField("Difficulty: ", body.difficulty, true)
                    .addField("USD/h (aprox.):", body.dollars_per_hour.toFixed(3), true);
                //    .setFooter(someTimeLeft(this.client.miner));
                msg.send(null, {embed});
            } else {
                msg.send("I don't know that guy");
            }
        } else {
            const info = this.client.economyMap.get(msg.author.id);
            const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
            const embed = new MessageEmbed()
                .setTitle("Current miner stats:")
                .setColor(0xB537B1)
                .addField("\nLevel:", info.miner, true)
                .addField("tH/s:\t", `${info.miner*1.28}tH/s`, true)
                .addField("Satoshi/h:", `${Math.floor(body.coins_per_hour/0.00000001)} Satoshi/h`)
                .addField("Difficulty: ", body.difficulty, true)
                .addField("USD/h (aprox.):", `${body.dollars_per_hour.toFixed(3)} USD/h`, true);
            //    .setFooter(someTimeLeft(this.client.miner));
            msg.send(null, {embed});
        }
    }
};
/*
function someTimeLeft(timeout) {
    var seconds =  ((timeout._idleTimeout + timeout._idleStart)/1000) - process.uptime();
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    return (`${numminutes}m${numseconds}s left for payout`);
}
*/
