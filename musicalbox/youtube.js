const MusicalBox = require("../pieces/MusicalBox");
const ytdl = require("ytdl-core");
const moment = require("moment");
const fetch = require("node-fetch");
const Util = require("../structures/Util");
const { google } = require("../auth.json");
const { Usage, TextPrompt } = require("klasa");

module.exports = class YoutubeMusicalBox extends MusicalBox {
    constructor(...args) {
        super(...args, {
            verify: /https?:\/\/www\.youtube\.com\/|https?:\/\/youtu\.be\//i,
            officialName: "YouTube"
        });
    }

    async run(msg, voiceChannel, arg) {
        const [,song] = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i.exec(arg) || []; // eslint-disable-line
        if(song) 
            return await this.song(msg, voiceChannel, song);
        const [,,playlist] = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist\?list=(.*)$/i.exec(arg) || [];
        if(playlist) 
            return await this.playlist(msg, voiceChannel, playlist);
        return "Not found";
    }

    async song(msg, voiceChannel, arg) {
        if(!ytdl.validateID(arg))
            return msg.send("Sorry but you need to give a valid YouTube URL");
        const body = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${arg}&key=${google}`).then(r => r.json());
        MusicalBox.handleSong({
            id: arg,
            title: Util.unescapeHTML(body.items[0].snippet.title),
            url: `https://www.youtube.com/watch?v=${arg}`,
            user: msg.author,
            time: moment.duration(body.items[0].contentDetails.duration).asMilliseconds(),
            thumbnail: body.items[0].snippet.thumbnails.default.url,
            colors: await MusicalBox.embedColor(body.items[0].snippet.thumbnails.default.url),
            type: "yt"
        }, msg, voiceChannel, this.client);
        return msg.send(`\`\`${Util.unescapeHTML(body.items[0].snippet.title)}\`\` has been added to the queue!`);
    }

    async playlist(msg, voiceChannel, arg) {
        const body = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${arg}&key=${google}`).then(r => r.json()),
            promise = fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${arg}&key=${google}`).then(r => r.json());
        if(body.items.length === 0) return msg.send("Sorry but you need to give a valid YouTube URL");
        const allIds = [];
        for(const video of body.items)
            allIds.push(video.snippet.resourceId.videoId);
        const tracks = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${allIds.join(",")}&key=${google}`).then(r => r.json());
        for(const track of tracks.items) {
            await MusicalBox.handleSong({
                id: track.id,
                title: Util.unescapeHTML(track.snippet.title),
                url: `https://www.youtube.com/watch?v=${track.id}`,
                user: msg.author,
                time: moment.duration(track.contentDetails.duration).asMilliseconds(),
                thumbnail: track.snippet.thumbnails.default.url,
                colors: await MusicalBox.embedColor(track.snippet.thumbnails.default.url),
                type: "yt"
            }, msg, voiceChannel, this.client);
        }
        const name = await promise;
        return msg.channel.send(`All the songs in \`\`${name.items[0].snippet.title}\`\` have been added to the queue!`);
    }

    async search(msg, voiceChannel, arg) {
        const sent = await msg.send("Asking YouTube...");
        let message = "```\n";
        const body = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet%2Cid&maxResults=10&q=${encodeURIComponent(arg)}&type=video&videoCategoryId=10&key=${google}`).then(r => r.json());
        if(body.items.length === 0) return sent.edit("Sorry but your query was invalid.");
        for (let i = 0; i < body.items.length; i++) 
            message += `[${i + 1}] - ${Util.unescapeHTML(body.items[i].snippet.title)}\n`;
        message += "```";
        await sent.delete();
        const textusage = new Usage(this.client, `<int:int{1,${body.items.length}}>`, "");
        const prompt = new TextPrompt(msg, textusage, { promptLimit: "1" });
        const [ fakeIndex ] = await prompt.run(`Which of these songs do you want to play?${message}`);
        const index = fakeIndex-1;
        const track = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${body.items[index].id.videoId}&key=${google}`).then(r => r.json());
        await msg.send(`\`\`${Util.unescapeHTML(body.items[index].snippet.title)}\`\` has been added to the queue!`);
        return MusicalBox.handleSong({
            id: body.items[index].id.videoId,
            title: Util.unescapeHTML(body.items[index].snippet.title),
            url: `https://www.youtube.com/watch?v=${body.items[index].id.videoId}`,
            user: msg.author,
            time: moment.duration(track.items[0].contentDetails.duration).asMilliseconds(),
            thumbnail: body.items[0].snippet.thumbnails.default.url,
            colors: await MusicalBox.embedColor(body.items[0].snippet.thumbnails.default.url),
            type: "yt"
        }, msg, voiceChannel, this.client);
    }
};