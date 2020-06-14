const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const authDetails = require("../../auth.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            aliases: ["saucenao"],
            usage: "[image:url]",
            description: "Tells you from where the image is",
            extendedHelp: "If you don't give an image URL it will use the most recent posted image (ignoring images sent by the bot)."
        });
    }

    async run(msg, [url]) {
        const sent = await msg.send("Talking to ``saucenao.com`` (and imgur)...");
        const body = await fetch(`https://saucenao.com/search.php?db=999&output_type=2&api_key=${authDetails.saucenao}&numres=5&url=${url ? url : msg.channel.lastOtherImage}`).then(res => res.json());
        if(body.header.status > 0 && !body.results.length) return sent.edit("Sorry but a Server-side error happened! Status code: " + body.header.status);
        if(body.header.status < 0) return sent.edit("Sorry but a Client-side error happened! (mostly it happens because url isnt an image) Status code: " + body.header.status);
        if(!msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) {
            const info = body.results[0];
            const sauceThumb = await fetch(info.header.thumbnail).then(res => res.buffer());
            const thumb = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                body: JSON.stringify({ image: `${sauceThumb.toString("base64")}`, type: "base64", name: "request"}),
                headers: { "Content-Type": "application/json", "Authorization": `Client-ID ${authDetails.imgur.clientID}` }
            }).then(res => res.json());
            if(!thumb.success) {
                this.client.emit("error", thumb);
                msg.send("sorry some shit happened");
            }
            const embed = new MessageEmbed()
                .setImage(thumb.data.link)
                .setTitle(info.data.title || info.data.source || info.data.sankaku_id || info.data.pawoo_user_display_name || info.data.danbooru_id)
                .setColor("PURPLE")
                .setDescription(`Similarity: ${info.header.similarity}%`);
            if(info.data.part) embed.addField("Part:", info.data.part, true);
            if(info.data.est_time) embed.addField("Timestamp:", info.data.est_time, true);
            if(info.data.ext_urls != null) embed.setURL(info.data.ext_urls[0]); 
            return msg.send({ embed });
        }
        const display = new RichDisplay();
        for(const info of body.results) {
            const sauceThumb = await fetch(info.header.thumbnail).then(res => res.buffer());
            const thumb = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                body: JSON.stringify({ image: `${sauceThumb.toString("base64")}`, type: "base64", name: "request"}),
                headers: { "Content-Type": "application/json", "Authorization": `Client-ID ${authDetails.imgur.clientID}` }
            }).then(res => res.json());
            if(!thumb.success) {
                this.client.emit("error", thumb);
                msg.send("sorry some shit happened");
                continue;
            }
            display.addPage(template => {
                template
                    .setImage(thumb.data.link)
                    .setTitle(info.data.title || info.data.source || info.data.sankaku_id || info.data.pawoo_user_display_name || info.data.danbooru_id)
                    .setColor("PURPLE")
                    .setDescription(`Similarity: ${info.header.similarity}%`);
                if(info.data.part) template.addField("Part:", info.data.part, true);
                if(info.data.est_time) template.addField("Timestamp:", info.data.est_time, true);
                return (info.data.ext_urls == null) ? template : template.setURL(info.data.ext_urls[0]); 
            });
        }
        return display.run(await sent.edit("\u200B"), {
            jump: false,
            time: 600000
        });
    }
};