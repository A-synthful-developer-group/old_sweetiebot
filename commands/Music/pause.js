const { Command } = require("klasa");

module.exports = class PauseCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "pause",
            cooldown: 3,
            description: "Pauses the song that is currently being played.",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        const serverQueue = this.client.music.get(msg.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            this.client.music.set(msg.guild.id, serverQueue);
            return msg.channel.send("Paused the music for you!");
        }
        return msg.channel.send("There is nothing playing.");
    }
};