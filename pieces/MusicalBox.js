const { Piece } = require("klasa");
const vibrant = require("node-vibrant");
const fetch = require("node-fetch");

module.exports = class MusicalBox extends Piece {

    constructor(client, store, file, core, options = {}) {
        super(client, store, file, core, options);

        this.verify = options.verify;
        this.officialName = options.officialName;
    }

    run() {
        // Defined in extension Classes
        throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
    }

    song() {
        // Defined in extension Classes
    }

    playlist() {
        // Defined in extension Classes
    }

    search() {
        // Defined in extension Classes
    }

    static async handleSong(song, msg, voiceChannel, client) {
        const serverQueue = client.music.get(msg.guild.id);
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 3,
                playing: true
            };
            client.music.set(msg.guild.id, queueConstruct);
    
            queueConstruct.songs.push(song);
    
            try {
                let connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                client.play(msg.guild, queueConstruct.songs[0]);
            } catch (error) {
                client.music.delete(msg.guild.id);
                return msg.channel.send(`I could not join the voice channel: \`\`${error}\`\``);
            }
        } else {
            serverQueue.songs.push(song);
        }
        return;
    }

    static async embedColor(thumbnail) {
        const body = await fetch(thumbnail).then(r => r.buffer());
        return vibrant.from(body).getPalette();
    }
};