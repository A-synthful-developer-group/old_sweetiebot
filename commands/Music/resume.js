const { Command } = require("klasa");

module.exports = class ResumeCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "resume",
            aliases: ["unpause"],
            cooldown: 4,
            description: "Resumes the song that was currently being played.",
            extendedHelp: "No extended help available."            
        });
    }

    async run(msg) {
        const serverQueue = this.client.music.get(msg.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            this.client.music.set(msg.guild.id, serverQueue);
            return msg.send("Resumed the music for you!");
        }
        return msg.send("There is nothing playing.");
    }
};
