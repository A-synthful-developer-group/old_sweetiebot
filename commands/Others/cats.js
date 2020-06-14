const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { parseString } = require("./../../structures/Util");
const authDetails = require("../../auth.json");

module.exports = class CatCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            aliases: ["cat"],
            extendedHelp: "No extended help available.",
            description: "Meooow, meow-meow meow (gives you a random cat image)"
        });
    }

    async run(msg) {
        const deletethis = await msg.send("Talking to Cat API...");
        const result = await fetch(`https://thecatapi.com/api/images/get?api_key=${authDetails.catApi}&format=xml&size=med`).then(r => r.text()).then(text => parseString(text));
        if (msg.channel.type === "dm" || msg.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
            const embed = new MessageEmbed()
                .setImage(result.response.data[0].images[0].image[0].url[0])
                .setColor("ORANGE");
            return deletethis.edit({ embed });
        } else if (msg.channel.permissionsFor(this.client.user).has("ATTACH_FILES")) {
            return msg.send({ files: [{ attachment: result.response.data[0].images[0].image[0].url[0] }] }).then(() => deletethis.delete());
        }
        return deletethis.edit("Sorry but I don't have permissions to send an Embed or an Attachment, ask the administration if I can have such permissions.");
    }
};
