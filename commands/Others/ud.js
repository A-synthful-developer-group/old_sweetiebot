const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["urbandictionary", "urban"],
            cooldown: 5,
            description: "Asks UrbanDictionary your stupid query for giving you a super intelectual definition",
            usage: "<query:str>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [query]) {
        const sent = await msg.send("Asking UrbanDictionary...");
        const body = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`).then(r => r.json());
        if(body.result_type === "no_results") return sent.edit("Couldn't find a definition of such word.");
        if (msg.channel.type === "dm" || msg.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
            const embed = new MessageEmbed()
                .setTitle(body.list[0].word)
                .setURL(body.list[0].permalink)
                .setColor("BLUE")
                .setFooter(`Thumbs Up: ${body.list[0].thumbs_up}\tThumbs Down: ${body.list[0].thumbs_down}`, "http://imurx.github.io/ud.png");
            if(body.list[0].definition.length > 1900) {
                embed.setDescription(body.list[0].definition.slice(0, 1900) + "...");
                embed.addField("More definition", "..." + body.list[0].definition.slice(1901));
            } else {
                embed.setDescription(body.list[0].definition);
            } 
            if(body.list[0].example) embed.addField("Example(s):", body.list[0].example);
            return sent.edit(null, { embed });
        } else {
            const example = (body.list[0].example) ? `\nExample(s):\n${body.list[0].example}` : "";
            return sent.edit(`${body.list[0].word}:\`\`\`\nDefinition:\n${body.list[0].definition}${example}\nThumbs Up:${body.list[0].thumbs_up}\tThumbs Down: ${body.list[0].thumbs_down}\`\`\`${body.list[0].permalink}`);
        }
    }
};
