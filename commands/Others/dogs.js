const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = class DogCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["dog"],
            cooldown: 5,
            description: "Woof-woof, woof woof (gives you a random dog image)",
            extendedHelp: "No extended help available.",
        });
    }

    async run(msg) {
        const deletethis = await msg.send("Talking to Dog API...");
        const body = await fetch("https://dog.ceo/api/breeds/image/random").then(r => r.json());
        if (msg.channel.type === "dm" || msg.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
            const embed = new MessageEmbed()
                .setImage(body.message)
                .setColor("ORANGE");
            return deletethis.edit({ embed });
        } else if (msg.channel.permissionsFor(this.client.user).has("ATTACH_FILES")) {
            return msg.send({ files: [{ attachment: body.message }] }).then(() => deletethis.delete());
        }
        return deletethis.edit("Sorry but I don't have permissions to send an Embed or an Attachment, ask the administration if I can have such permissions.");
    }
};
