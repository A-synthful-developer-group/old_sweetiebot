const { Client } = require("klasa");
const MusicalBoxStore = require("./stores/MusicalBoxStore");
const SentenceStore = require("./stores/SentenceStore");
const ytdl = require("ytdl-core-discord");
const Cache = require("./structures/Cache");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");

module.exports = class SweetieClient extends Client {

    constructor(...args) {
        super(...args);

        this.musicalbox = new MusicalBoxStore(this);
        this.sentences = new SentenceStore(this);

        this.registerStore(this.musicalbox);
        this.registerStore(this.sentences);

        this.cache = new Cache();
        
        this.things = low(adapter);
    }

    async play(guild, song) {
        const serverQueue = this.music.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.music.delete(guild.id);
            return;
        }
        const stream = (song.type === "yt") ? await ytdl(song.url).catch(e => {
            serverQueue.textChannel.send(`ytdl gave ${e} error, playing next song...`);
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        }) : ((song.type === "other") ? song.stream : `${song.file}`);
        const dispatcher = serverQueue.connection.play(stream, { passes: 2, fec: true, bitrate: "auto", highWaterMark: (song.type === "yt") ? 1<<25 : 1, type: (song.type === "yt") ? "opus" : "unknown" })
            .on("end", reason => {
                if (reason === "Stream is not generating quickly enough.") this.emit("log", "Song ended.");
                else this.emit("log", reason);
                this.emit("songEnded", serverQueue.songs[0], serverQueue.songs[1]);
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
            })
            .on("error", error => this.emit("error", error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
        serverQueue.textChannel.send(`Started playing: \`\`${song.title}\`\` requested by: \`\`${song.user.tag}\`\``);
    }

};

