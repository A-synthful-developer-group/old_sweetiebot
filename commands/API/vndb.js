const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const VNDB = require("../../structures/VNDB");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            description: "Replies you with the asked info from VNDB",
            usage: "<str:str>",
            extendedHelp: "No extended help available.",
        });
    }


    async run(msg, [title]) {
        const { items } = await this.client.vndb.get("vn", ["basic","details"], `(title ~ "${title}")`);
        const item = items[0];
        if(items.length == 0) return msg.send("Couldn't find any VN with such name");
        if(msg.channel.type === "dm" || msg.channel.embedable) {
            const embed = new MessageEmbed()
                .setTitle(item.title)
                .setURL(`https://vndb.org/v${item.id}`)
                .setColor("#258");
            if(item.original) embed.addField("Original Title:", item.original, true);
            if(item.description) embed.setDescription(item.description);
            if(item.released) embed.addField("Released:", item.released, true);
            if(item.length) embed.addField("Length:", item.length, true);
            if(item.image_nsfw) {
                if(msg.channel.nsfw) embed.setThumbnail(item.image);
            } else {
                if(item.image) embed.setThumbnail(item.image);
            }
            msg.send({ embed });
        }
    }

    async init() {
        this.client.vndb = new VNDB({ clientName: "NononBot" });
        this.client.vndb.connection.on("data", string => {
            this.client.emit("log", string);
        });
        await this.client.vndb.login();
    }
};