const { Command } = require("klasa");
const authDetails = require("../../auth.json");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["cb", "cleverb", "ask"],
            cooldown: 5,
            description: "Replies you with an answer from Cleverbot",
            usage: "<str:str>",
            enabled: false,
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [str]) {
        const sent = await msg.send("Asking Cleverbot...");
        const getURL = input => `http://www.cleverbot.com/getreply?key=${authDetails.cleverbot_api}&input=${input}&cs=${this.client.cbCs}`;
        const url = getURL(encodeURIComponent(str));
        const json = await fetch(url).then(r => r.json());
        sent.edit(`\`\`\`${json.output}\`\`\``, {reply: msg});
    }
    /*async init() {
        const { body } = await snekfetch.get(`http://www.cleverbot.com/getreply?key=${authDetails.cleverbot_api}`);
        this.client.cbCs = body.cs;
        this.client.emit("log", `CB: ${body.output}`);
    }*/
};