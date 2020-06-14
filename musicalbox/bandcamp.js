const MusicalBox = require("../pieces/MusicalBox");
const fetch = require("node-fetch");
const dns = require("dns").promises;
const bandcamp = require("node-bandcamp");
const { Usage, TextPrompt } = require("klasa");

module.exports = class BandcampMusicalBox extends MusicalBox {
    constructor(...args) {
        super(...args, {
            verify: async link => {
                if(/^(https?:\/\/)?\w*\w\.bandcamp\.com\/(album|track)/i.test(link)) return true;
                const url = new URL(link);
                const dnsList = await dns.resolveAny(url.hostname);
                if(dnsList.some(data => {
                    if(data.type === "A") {
                        return data.address === "35.241.62.186";
                    } else if(data.type === "CNAME") {
                        data.value === "dom.bandcamp.com";
                    }
                })) {
                    return /\/(album|track)/i.test(link);
                }
                return false;
            },
            officialName: "Bandcamp"
        });
    }

    async run(msg, voiceChannel, arg) {
        const text = await fetch(encodeURI(arg)).then(r => r.text());
        const [,res] = /trackinfo: (\[{.*),/.exec(text) || [], // COOL REGEXPS BUT WHAT ARE THOSE
            [,artwork] = /art_id: (\d*),/.exec(text) || [],  //Heh, they are just a nice thing from bandcamp
            [,album] = /album_title: "(.*)"/.exec(text) || [], //http://bandcamp.com/help/audio_basics#steal
            [,artist] = /artist: "(.*)"/.exec(text) || [];
        if(!res) return "Not found";
        const obj = JSON.parse(res);
        return await this.song(msg, voiceChannel, {artist: artist, artwork: artwork, album: album, songs: obj});
    }

    async song(msg, voiceChannel, arg, playlist = (arg.songs.length > 1) ? true : false) {
        for(const song of arg.songs) {
            await MusicalBox.handleSong({
                id: song.id,
                title: song.title,
                url: `https://${arg.artist}.bandcamp.com${song.title_link}`,
                stream: song.file["mp3-128"],
                user: msg.author,
                time: song.duration * 1000,
                thumbnail: `https://f4.bcbits.com/img/a${arg.artwork}_16.jpg`,
                colors: (arg.artwork) ? await MusicalBox.embedColor(`https://f4.bcbits.com/img/a${arg.artwork}_16.jpg`) : "RANDOM",
                type: "other"
            }, msg, voiceChannel, this.client);
        }
        if(playlist) return msg.send(`All songs in the album \`\`${arg.album}\`\` have been added to the queue!`);
        return msg.send(`\`\`${arg.songs[0].title}\`\` has been added to the queue!`);
    }

    async playlist(msg, voiceChannel, arg) {
        return await this.song(msg, voiceChannel, arg);
    }

    async search(msg, voiceChannel, arg) {
        const sent = await msg.send("Asking Bandcamp...");
        let message = "```\n";
        const list = await bandcamp.trackSearch(arg, 10);
        if(list.length === 0) return sent.edit("Sorry but your query was invalid.");
        for (let i = 0; i < ((list.length < 11) ? list.length : 10); i++)
            message += `[${i + 1}] - ${list[i].title}\n`;
        message += "```";
        await sent.delete();
        const textusage = new Usage(this.client, `<int:int{1,${(list.length < 11) ? list.length : 10}}>`, "");
        const prompt = new TextPrompt(msg, textusage, { promptLimit: "1" });
        const [ index ] = await prompt.run(`Which of these songs do you want to play?${message}`);
        return await this.run(msg, voiceChannel, list[index - 1].url);
    }
    
    async init() {
        await dns.setServers([
            "8.8.8.8",
            "8.8.4.4"
        ]);
    }
};
