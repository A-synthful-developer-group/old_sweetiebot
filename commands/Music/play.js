const { Command } = require("klasa");

module.exports = class PlayCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "play",
            aliases: ["listen", "p"],
            cooldown: 5,
            description: "Plays a song in the voice channel you are in.",
            usage: "<text:str>",
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [text]) {
        const flag = Object.values(msg.flags)[0];
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.send("I'm sorry but you need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT")) {
            return msg.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
        }
        if (!permissions.has("SPEAK")) {
            return msg.send("I cannot speak in this voice channel, make sure I have the proper permissions!");
        }
        const queue = this.client.music.get(msg.guild.id);
        if(queue && queue.radio) {
            queue.connection.dispatcher.end("Stop command has been used!");
            this.client.music.delete(msg.guild.id);
            await queue.voiceChannel.leave();
        }
        const link = await this.client.musicalbox.verify(text);
        if(link) return await link.run(msg, voiceChannel, text);
        const searchEngine = this.client.musicalbox.get((flag) ? flag.toLowerCase() : flag);
        return await (searchEngine) ? searchEngine.search(msg, voiceChannel, text) : this.client.musicalbox.get("youtube").search(msg, voiceChannel, text);
    }
};