const { Command } = require("klasa");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            usage: "[number:int{2}]",
            description: "Skips to the next song on the queue.",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg, [num]) {
        if(!msg.member.voice.channel) return msg.send("You are not in a voice channel!");
        const serverQueue = this.client.music.get(msg.guild.id);
        if(!serverQueue) return msg.send("There is nothing playing that I could skip for you.");
        if(serverQueue.radio) return msg.send("There is a radio playing and this command isn't supported for that!");
        if(num) {
            if(num-1 == serverQueue.songs.length) {
                serverQueue.songs = [];
                serverQueue.connection.dispatcher.end("Skip command has been used!");
                this.client.music.set(msg.guild.id, serverQueue);
                return undefined;
            }
            if(num-1>serverQueue.songs.length)
                return msg.send("I dont see that we have a queue THAT long.");
            serverQueue.songs.splice(0, num-1);
            this.client.music.set(msg.guild.id, serverQueue);            
        }
        serverQueue.connection.dispatcher.end("Skip command has been used!");
        return undefined;
    }
};