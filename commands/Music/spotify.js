const { Command } = require("klasa");
const fetch = require("node-fetch");

module.exports = class SpotifyCommand extends Command {
    constructor(...args) {
        super(...args, {
            usage: "<artist|track|album> <query:str> [...]",
            usageDelim: " ",
            cooldown: 4,
            description: "Lets you do a query to spotify.",
            aliases: ["potify"],
            extendedHelp: "No extended help available."            
        });
    }

    async run(msg, [option, ...somestrings]) {
        const query = somestrings.join(" ");
        const sent = await msg.send("Asking Spotify...");
        const accessToken = await this.client.cache.get("spotify");
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&market=US&limit=1&type=${option}`;
        const body = await fetch(url, {
            headers: { "Authorization": "Bearer " + accessToken }
        })
            .then(r => r.json())
            .catch(r => {
                this.client.emit("error", r);
                throw "An error happened with Spotify, sorry!";
            });
        if(body[option + "s"].items[0] !== undefined) return sent.edit(`Ok! I have found the ${option} you requested (I think?)...\nHere you have: ${body[option + "s"].items[0].external_urls.spotify}`);
        return sent.edit(`I couldn't find the ${option} you requested.`);
    }

};
