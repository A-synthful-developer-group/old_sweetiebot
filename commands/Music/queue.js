const { Command } = require("klasa");
const Util = require("./../../structures/Util");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            aliases: ["q"],
            description: "Tells you whats the queue of songs.",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg) {
        const serverQueue = this.client.music.get(msg.guild.id);
        if (!serverQueue) return msg.send("There is nothing playing.");
        if(serverQueue.radio) return msg.send("There is a radio playing and this command isn't supported for that!");
        await msg.channel.send("**Song queue:**");
        await msg.channel.sendCode("", `${serverQueue.songs.map((song, index) => `[${index+1}] - ${song.title} (by ${song.user.tag}; PT:${Util.readableTime(song.time)})`).join("\n")}\n`, { split: { 
            prepend: "```",
            append: "```"
        }});
        return msg.channel.send(`**Now playing:** \`\`${serverQueue.songs[0].title}\`\` requested by \`\`${serverQueue.songs[0].user.tag}\`\` with a duration of ${Util.readableTime(serverQueue.songs[0].time)}`);
    }
};
