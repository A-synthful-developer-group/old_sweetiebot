const { Command } = require("klasa");

module.exports = class VolumeCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["vol"],
            description: "Changes the current volume of the song playing.",
            usage: "[volume:integer{0,10}]",
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [volume]) {
        if (!msg.member.voice.channel) return msg.send("You are not in a voice channel!");
        const serverQueue = this.client.music.get(msg.guild.id);
        if (!serverQueue) return msg.send("There is nothing playing.");
        if (!volume) return msg.send(`The current volume is: \`\`${niceVolume(serverQueue.volume)}\`\` - ${serverQueue.volume*10}%`);
        serverQueue.volume = volume;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
        this.client.music.set(msg.guild.id, serverQueue);
        return msg.send(`Changed the volume to \`\`${niceVolume(serverQueue.volume)}\`\` - ${serverQueue.volume*10}%`);
    }
};

function niceVolume(volume) {
    let string = "";
    if(volume > 0) {
        for(let i = 0; i<volume; i++)
            string += "▮";
        if(string.length != 10) {
            while(string.length < 10)
                string += "•";
        }
    } else {
        string = "••••••••••";
    }
    return string;
}