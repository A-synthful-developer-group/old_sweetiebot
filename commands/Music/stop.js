const { Command } = require("klasa");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            description: "Stops the song that is currently being played.",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg) {
        if (!msg.member.voice.channel) return msg.send("You are not in a voice channel!");
        const serverQueue = this.client.music.get(msg.guild.id);
        if (!serverQueue) return msg.send("There is nothing playing that I could stop for you.");
        if(serverQueue.radio) {
            serverQueue.connection.dispatcher.end("Stop command has been used!");
            this.client.music.delete(msg.guild.id);
            serverQueue.voiceChannel.leave();
            return undefined;
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end("Stop command has been used!");
            this.client.music.set(msg.guild.id, serverQueue);
            return undefined;
        }
    }
};