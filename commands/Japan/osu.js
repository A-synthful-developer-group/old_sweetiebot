const { Command } = require("klasa");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            usage: "<osu!user:str>",
            description: "Tells you your osu! stats",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [user]) {
        const sent = await msg.send(`Searching for ${user} in osu!...`);
        const buffer = await fetch(`https://lemmmy.pw/osusig/sig.php?colour=hexe01d92&uname=${encodeURIComponent(user)}&pp=0&countryrank&flagstroke&darktriangles&onlineindicator=undefined&xpbar&xpbarhex`).then(r => r.buffer());
        if (msg.channel.type === "dm" || msg.channel.permissionsFor(this.client.user).has("ATTACH_FILES")) return msg.send({ files: [{ attachment: buffer }] }).then(() => sent.delete());
        return sent.edit("Sorry but I don't have permissions to send an Attachment, ask the administration if I can have such permissions.");
    }
};