const { Command, util } = require("klasa");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            usage: "<url:url>",
            description: "Plays a readeable audio stream (a radio).",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg, [url]) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.send("I'm sorry but you need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT")) {
            return msg.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
        }
        if (!permissions.has("SPEAK")) {
            return msg.send("I cannot speak in this voice channel, make sure I have the proper permissions!");
        }    
        const serverQueue = this.client.music.get(msg.guild.id);
        if(serverQueue) {
            if (serverQueue.songs) return msg.send("There are songs playing.");
            if (serverQueue.radio) {
                serverQueue.connection.dispatcher.end("Stop command has been used!");
                this.client.music.delete(msg.guild.id);
                await serverQueue.voiceChannel.leave();
                await util.sleep(1000);
                return play(msg, voiceChannel, url, this.client);
            }
        } else {
            return play(msg, voiceChannel, url, this.client);
        }
    }
};

async function play(msg, voiceChannel, url, client) {
    const serverConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        radio: url,
        volume: 3,
        playing: true
    };
    try {
        const connection = await voiceChannel.join();
        connection.play(url, { passes: 3, fec: true, bitrate: "auto" })
            .on("end", reason => {
                if (reason === "Stream is not generating quickly enough.") client.emit("log", "Song ended.");
                else client.emit("log", reason);
                client.music.delete(msg.guild.id);
                voiceChannel.leave();
            })
            .on("error", error => this.client.emit("error", error));
        serverConstruct.connection = connection;
        client.music.set(msg.guild.id, serverConstruct);
        return msg.send(`Playing songs from the radio: \`\`${url}\`\``);
    } catch(er) {
        client.music.delete(msg.guild.id);
        return msg.send(`An error occurred while trying to play the radio: \`\`${er}\`\``);
    }
}