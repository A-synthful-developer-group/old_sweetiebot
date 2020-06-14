const { Monitor } = require("klasa");
const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");
let myGuildUser;

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            enabled: true,
            ignoreBots: false,
            ignoreSelf: true,
            ignoreOthers: false
        });
    }

    async run(msg) {
        if(msg.channel.type !== "text") return;
        if(!msg.guild.settings.get("cancerMode")) return;
        const content = msg.content.toLowerCase();
        let hey = -1;
        if(content.includes("fact")) hey = Math.floor(Math.random()*3);
        if(content.includes("factuality")) return msg.send("Factualaliality");
        const testing = content.match(/factuala(lia)+lity/);
        const [test] = (testing) ? testing : [null];
        if(test && (test.length) < 1997 ) return msg.send("F" + test.substr(1, test.length - 5) + "liality");
        if(content.includes("factual")) return msg.send("Factuality");
        if(hey === 0) return msg.send("Factual");
        if(hey === 1) return msg.send("It isnt a fact, it's reality itself");
        if(hey === 2) return;
        if(content.includes("lewd") && msg.channel.nsfw) {
            const { body } = await snekfetch.get("https://nekos.life/api/lewd/neko");
            const embed = new MessageEmbed()
                .setImage(body.neko);
            return msg.send(`${msg.author.username} you lewd!`, { embed });
        }
        if((content.includes("garlicoin") || content.includes("grlc")) && content.includes("lambo")) return msg.send("I've already bought 100 lambos with each coin I got, now I can't make my garage have all of them, I'm thinking of buying a garage but 1 GRLC is equal 1 Lambo, nothing more and nothing less.");
        if(content.includes("fuck me")) return msg.send(msg.author.id === myGuildUser ? "Maybe..." : "You are too ugly :C");
        if(content.includes("w_b is a normal tbh")) return msg.send(`no u <@${msg.author.id}>`);
    }
    async init() {
        myGuildUser = this.client.guilds.get("406683099012005898").members.randomKey();
        this.client.emit("log", `Magical ID is ${myGuildUser}`);
    }
};
