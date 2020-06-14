const MusicalBox = require("../pieces/MusicalBox");
const fetch = require("node-fetch");
const { Util } = require("discord.js");
const { soundcloud } = require("../auth.json");
const { Usage, TextPrompt } = require("klasa");

module.exports = class SoundcloudMusicalBox extends MusicalBox {
    constructor(...args) {
        super(...args, {
            verify: /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com/i,
            officialName: "SoundCloud"
        });
    }

    async run(msg, voiceChannel, arg) {
        const find = await fetch(`https://api.soundcloud.com/resolve?url=${arg}&_status_code_map[302]=200&_status_format=json&client_id=${soundcloud}`).then(r => r.json());
        if(find.status !== "302 - Found") return "Not found";
        const [,type] = /^https:\/\/api.soundcloud.com\/(playlists|tracks)\//.exec(find.location);
        if(!type) return "Not found";
        const body = await fetch(find.location).then(r => r.json());
        if(type === "tracks") return await this.song(msg, voiceChannel, body);
        return await this.playlist(msg, voiceChannel, body);
    }

    async song(msg, voiceChannel, arg, playlist = false) {
        if(!arg.streamable) return msg.send("The song isn't streamable");
        MusicalBox.handleSong({
            id: arg.id,
            title: Util.escapeMarkdown(arg.title),
            url: arg.permalink_url,
            stream: `${arg.stream_url}?client_id=${soundcloud}`,
            user: msg.author,
            time: arg.duration,
            thumbnail: arg.artwork_url,
            colors: (arg.artwork_url) ? await MusicalBox.embedColor(arg.artwork_url) : "RANDOM",
            type: "other"
        }, msg, voiceChannel, this.client);
        if(playlist) return;
        return msg.send(`\`\`${Util.escapeMarkdown(arg.title)}\`\` has been added to the queue!`);
    }

    async playlist(msg, voiceChannel, arg) {
        for(const track of arg.tracks) {
            if(!track.streamable) continue;
            await this.song(msg, voiceChannel, track, true);
        }
        return msg.send(`All the songs in \`\`${arg.title}\`\` have been added to the queue!`);
    }

    async search(msg, voiceChannel, arg) {
        const sent = await msg.send("Asking SoundCloud...");
        let message = "```\n";
        const body = await fetch(`http://api.soundcloud.com/tracks?client_id=${soundcloud}&q=${encodeURIComponent(arg)}&limit=15`).then(r => r.json());
        if(body.length === 0) return sent.edit("Sorry but your query was invalid.");
        const arr = body.filter(value => value.streamable);
        for (let i = 0; i < ((arr.length < 11) ? arr.length : 10); i++)
            message += `[${i + 1}] - ${arr[i].title}\n`;
        message += "```";
        await sent.delete();
        const textusage = new Usage(this.client, `<int:int{1,${(arr.length < 11) ? arr.length : 10}}>`, "");
        const prompt = new TextPrompt(msg, textusage, { promptLimit: "1" });
        const [ fakeIndex ] = await prompt.run(`Which of these songs do you want to play?${message}`);
        const index = fakeIndex-1;
        await msg.send(`\`\`${Util.escapeMarkdown(body[index].title)}\`\` has been added to the queue!`);
        return MusicalBox.handleSong({
            id: body[index].id,
            title: Util.escapeMarkdown(body[index].title),
            url: body[index].permalink_url,
            stream: `${body[index].stream_url}?client_id=${soundcloud}`,
            user: msg.author,
            time: body[index].duration,
            thumbnail: body[index].artwork_url,
            colors: (body[index].artwork_url) ? await MusicalBox.embedColor(body[index].artwork_url) : "RANDOM",
            type: "other"
        }, msg, voiceChannel, this.client);
    }
};