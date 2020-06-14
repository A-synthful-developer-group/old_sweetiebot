const { Command } = require("klasa");
const fetch = require("node-fetch");
const authDetails = require("../../auth.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            description: "test",
            usage: "<Subreddit:str>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [string]) {
        const sent = await msg.send("Searching for an image...");
        const request = await fetch(`https://api.pushshift.io/reddit/search/submission/?subreddit=${string}&metadata=true&size=0&after=1483246800`).then(r => r.json());
        if(request.metadata.total_results === 0) return sent.edit("The subreddit doesn't exist or doesn't have any post");
        const randomNumber = Math.floor(Math.random() * Math.floor(request.metadata.total_results/28));
        const body = await fetch(`https://api.imgur.com/3/gallery/r/${string}/time/${randomNumber}`, {
            headers: { "Authorization": `Client-ID ${authDetails.imgur.clientID}` }
        }).then(r => r.json());
        const randomArray = Math.floor(Math.random() * (body.data.length-1));
        if(!body.data[randomArray]) {
            const result = await fetch(`https://api.imgur.com/3/gallery/r/${string}/time/0`, {
                headers: { "Authorization": `Client-ID ${authDetails.imgur.clientID}` }
            }).then(r => r.json());
            const newRandomArray = Math.floor(Math.random() * (result.data.length-1));
            if(result.data[newRandomArray].nsfw && (msg.channel.type !== "dm") ? (!msg.channel.nsfw) : false) return sent.edit("Sorry, but the image I found is NSFW.");
            return sent.edit(result.data[newRandomArray].link);
        }
        if(body.data[randomArray].nsfw && (msg.channel.type !== "dm") ? (!msg.channel.nsfw) : false) return sent.edit("Sorry, but the image I found is NSFW.");
        return sent.edit(body.data[randomArray].link);
    }
};
