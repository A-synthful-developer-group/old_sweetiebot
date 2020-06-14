const { Command } = require("klasa");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 20,
            description: "Shuffles the songs in the current queue.",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg) {
        const serverQueue = this.client.music.get(msg.guild.id);
        if (!serverQueue) return msg.send("There is nothing playing.");
        if(serverQueue.radio) return msg.send("There is a radio playing and this command isn't supported for that!");
        const copyOf0 = serverQueue.songs[0];
        serverQueue.songs.shift();
        let currentIndex = serverQueue.songs.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temporaryValue = serverQueue.songs[currentIndex];
            serverQueue.songs[currentIndex] = serverQueue.songs[randomIndex];
            serverQueue.songs[randomIndex] = temporaryValue;
        }
        serverQueue.songs.splice(0, 0, copyOf0);
        return msg.send("The songs have been shuffled, check ``s!q`` to check the new queue!");
    }
};