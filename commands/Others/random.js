const { Command, Stopwatch } = require("klasa");
const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");
const fetch = require("node-fetch");
const authDetails = require("../../auth.json");
const words = require("random-word");
const randomSentence = require("random-sentence");
const domains = require("domains");
const rules = require("./rules.json");
const quotes = require("./quotes.json");
const sharp = require("sharp");
const MersenneTwister = require("mersenne-twister");

module.exports = class random extends Command {
    constructor(...args) {
        super(...args, {
            subcommands: true,
            cooldown: 6,
            aliases: ["rand"],
            usage: "<spotify|lastfm|letter|number|vndb|shutter|word|sentence|roi|domain|quote|anime> [str:str] [...]",
            usageDelim: " ",
            description: "Let's you generate a random thing.",
            extendedHelp: "Spotify: you can use the next argument for searching a genre, ex: s!random spotify pop\nNumber: you choose the max number by saying it on the next argument, ex: s!random number 20\nShutter: You can choose a random specific topic by saying it on the next argument, ex: s!random shutter robbery\nWord: you can choose a random amount of words to make something like a sentence (Limit: 1-20), ex: s!random word 10\nSentence: you can choose a random amount of word in the sentence by saying the quantity in the next number (Limit: 1-20), ex: s!random sentence 15\nDomain: you can choose the amount of words the page is going to have (Limit: 1-5), ex: s!random domain 3"
        });
    }

    async spotify(msg, [...array]) {
        const str = array.join(" ");
        const sent = await msg.send("Searching for a random song on Spotify...");
        const accessToken = await this.client.cache.get("spotify");
        const randomOffset = Math.round(Math.random() * 100);
        const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        const url = str ? `https://api.spotify.com/v1/search?q=${randomLetter}%20genre:${str.replaceAll(" ", "-")}&market=US&limit=1&type=track&offset=${randomOffset}` : `https://api.spotify.com/v1/search?q=${randomLetter}&market=US&limit=1&type=track&offset=${randomOffset}`;
        const { body } = await snekfetch.get(url, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .catch(r => {sent.edit("An error just happened with Spotify, sorry!"); this.client.emit("log", r);});
        if(body.tracks.items[0] !== undefined) return sent.edit(`Ok! I have found a track...\nHere you have: ${body.tracks.items[0].external_urls.spotify}`);
        if(body.tracks.total === 0 && str) return sent.edit("Sorry but that kind of genre doesn't exist.");
        if(body.tracks.total === 0) return sent.edit("I couldn't find any tracks.");
        await sent.edit("Wait... I'm having a hard time finding a song.");
        const randomOffset2 = Math.round(Math.random() * parseInt(body.tracks.total));
        const url2 = str ? `https://api.spotify.com/v1/search?q=${randomLetter}%20genre:${str.replaceAll(" ", "-")}&market=US&limit=1&type=track&offset=${randomOffset2}` : `https://api.spotify.com/v1/search?q=${randomLetter}&market=US&limit=1&type=track&offset=${randomOffset2}`;
        const response = await snekfetch.get(url2, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .catch(r => {sent.edit("An error just happened with Spotify, sorry!"); this.client.emit("log", r);});
        if(response.body.tracks.items[0] !== undefined) return sent.edit(`Ok! I have found a track...\nHere you have: ${response.body.tracks.items[0].external_urls.spotify}`);
        this.client.emit("log", body.tracks);
        return sent.edit("Sorry but I couldnt find any tracks.");
    }

    async lastfm(msg, [...array]) {
        const str = array.join(" ");
        const username = (str !== "") ? str : msg.author.configs.get("lastfm");
        if(!username) return msg.send("Sorry but you need to insert a user or add your user to your user configuration in the bot by doing ``s!userconf set lastfm (user)``");
        const clock = new Stopwatch(3);
        const sentReq = await msg.send(`Asking to Last.FM about ${(str !== "") ? str : "your"}'s favorites songs`);
        const { body } = await snekfetch.get(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&limit=75&api_key=${authDetails.lastfm}&format=json`).catch(r => {sentReq.edit("An error just happened with Last.FM, sorry!"); this.client.emit("log", r);});
        if(body.error !== undefined) return sentReq.edit("Sorry but the following error happened: " + body.message);
        const userinfoReq = snekfetch.get(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${authDetails.lastfm}&format=json`).catch(r => {sentReq.edit("An error just happened with Last.FM, sorry!"); this.client.emit("log", r);});
        const number = Math.floor(Math.random() * body.toptracks.track.length);
        const track = body.toptracks.track[number];
        const accessToken = await this.client.cache.get("spotify");
        const responseReq = snekfetch.get(`https://api.spotify.com/v1/search?q=${track.name} ${track.artist.name}&market=US&limit=1&type=track`, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).catch(r => {sentReq.edit("An error just happened with Last.FM, sorry!"); this.client.emit("log", r);});
        const safeLink = link => {
            return link.replace(/\(/g, "%28").replace(/\)/g, "%29");
        };
        const embed = new MessageEmbed()
            .setThumbnail(track.image[2]["#text"])
            .setColor("#E4141E")
            .addField("Track:", `[${track.name}](${safeLink(track.url)})`, true)
            .addField("Artist:", `[${track.artist.name}](${safeLink(track.artist.url)})`, true);
        const [response, userinfo] = await Promise.all([responseReq, userinfoReq]);
        clock.stop();
        embed.setFooter("Completed using the Last.FM and Spotify API in " + clock.friendlyDuration);
        embed.setAuthor(`Randomly found track from the top tracks of ${userinfo.body.user.name}`, userinfo.body.user.image[2]["#text"], userinfo.body.user.url);
        if(response !== undefined && response.body.tracks.items[0] !== undefined) embed.addField("Spotify Link:", `[Link](${response.body.tracks.items[0].external_urls.spotify})`);
        embed.addField("Additional Info:", `Play count: ${track.playcount}\tRank in their top list: ${track["@attr"].rank}`);
        return sentReq.edit(null, { embed });
    }

    letter(msg) {
        return msg.send(String.fromCharCode(
            Math.floor(Math.random() * 26) + 97
        ));
    }

    number(msg, [...array]) {
        const str = array.join(" ");
        if(isNaN(str)) return msg.send("Sorry, but thats not a number.");
        return msg.send(String(Math.floor(Math.random() * parseInt(str))));
    }

    vndb(msg) {
        return msg.send(`https://vndb.org/v${Math.floor(Math.random() * 22100) + 1}`);
    }

    async shutter(msg, [...array]) {
        const str = array.join(" ");
        const sent = await msg.send("Asking Shutterstock...");
        const input = str ? str : (words());
        const { body } = await snekfetch.get(`https://api.shutterstock.com/v2/images/search?query=${input}&sort=random&per_page=1`, {
            headers: {
                "Authorization": "Basic " + Buffer.from(`${authDetails.shutterstock.clientID}:${authDetails.shutterstock.clientSecret}`).toString("base64")
            }
        });
        const embed = new MessageEmbed()
            .setImage(body.data[0].assets.preview.url);
        return sent.edit(body.data[0].description, { embed });
    }

    word(msg, [...array]) {
        const str = array.join(" ");
        const int = parseInt(str);
        if(str && !isNaN(str) && int > 0 && int < 21) {
            const custominteger = int;
            let arrayofwords = [];
            for(var i = 0; i<custominteger; i++) {
                arrayofwords.push(words());
            }
            return msg.send(arrayofwords.join(" "));
        }
        return msg.send(words());
    }

    sentence(msg, [...array]) {
        const str = array.join(" ");
        const int = parseInt(str);
        if(str && !isNaN(str) && int > 0 && int < 21)
            return msg.send(randomSentence({ words: str}));
        return msg.send(randomSentence());
    }

    roi(msg) {
        return msg.send(`\`\`\`${rules.rules[Math.floor(Math.random() * rules.rules.length)]}\`\`\``);
    }

    domain(msg, [...array]) {
        const str = array.join(" ");
        const int = parseInt(str);
        if(str && !isNaN(str) && int > 0 && int < 6) {
            const custominteger = int;
            const arrayofwords = [];
            for(let i = 0; i<custominteger; i++) {
                arrayofwords.push(words());
            }
            return msg.send(`${arrayofwords.join("-")}.${domains[Math.floor(Math.random() * domains.length)]}`);
        }
        const randominteger = Math.floor(Math.random() * 4) + 1;
        const arrayofwords = [];
        for(let i = 0; i<randominteger; i++) {
            arrayofwords.push(words());
        }
        return msg.send(`${arrayofwords.join("-")}.${domains[Math.floor(Math.random() * domains.length)]}`);
    }

    quote(msg) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return msg.send(`${quote.quoteText}\n- ${quote.quoteAuthor}`);
    }

    async anime(msg) {
        const flags = Object.values(msg.flags);
        const generator = new MersenneTwister();
        const image = new Uint8ClampedArray(921600); 
        let i = 0; 
        while(i < image.length) { 
            const color = new Uint8ClampedArray(3);
            for(let k = 0; k<3; k++) {
                color[k] = Math.floor(generator.random()*256);
            } 
            for(let j = 0; j < 25600; j++) { 
                for(let k = 0; k<3; k++) {
                    image[i] = color[k]; 
                    i++;
                }
            }
        }
        const buffer = await sharp(Buffer.from(image.buffer), { 
            raw: { width: 640, height: 480, channels: 3}
        })
            .jpeg()
            .toBuffer(); 
        const sent = await msg.send("Talking to ``trace.moe``... (Might take some time)");
        const body = await fetch(`https://trace.moe/api/search?token=${authDetails.whatanime}`, {
            method: "POST",
            body: JSON.stringify({ image: `data:image/jpeg;base64,${buffer.toString("base64")}` }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }).then(res => res.json());
        if(!body.docs[0]) return msg.send("Couldn't find something similar, sorry!");
        await sent.delete();
        if(flags && flags.some(value => value.toLowerCase() == "nerd")) {
            return msg.channel.send(makeNiceText(body.docs[0], msg.channel), { files: [buffer] });
        }
        return msg.channel.send(makeNiceText(body.docs[0], msg.channel));
    }

    async init() {
        this.client.emit("log", "Asking Spotify for a new Access Token...");
        await snekfetch.post("https://accounts.spotify.com/api/token", {
            data: { 
                grant_type: "refresh_token", refresh_token: authDetails.spotify.refreshToken
            },
            headers: {
                "Authorization": "Basic " + Buffer.from(`${authDetails.spotify.clientID}:${authDetails.spotify.clientSecret}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(r => this.client.cache.set("spotify", r.body.access_token, 3600));
        this.client.emit("log", "Saved new Spotify Access Token on DB!");
    }
};

function makeNiceText(info, channel) {
    if(!info) return false;
    let text = "";
    text += `**Anime:** ${info.title_romaji}
**MyAnimeList URL:** <https://myanimelist.net/anime/${info.mal_id}>
**AniList URL:** <https://anilist.co/anime/${info.anilist_id}>`;
    text += (info.is_adult && !channel.nsfw) ? "\nNSFW!" : "";
    return text;
}

String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};
