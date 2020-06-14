const { Command } = require("klasa");
const Util = require("./../../structures/Util");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const sharp = require("sharp");

module.exports = class NowPlayingCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            aliases: ["playing"],
            description: "Tells you what's currently being played.",
            extendedHelp: "No extended help available."  
        });
        this.palette = [
            "DarkMuted",
            "Vibrant",
            "LightVibrant"
        ];
    }

    async run(msg) {
        const flags = Object.values(msg.flags);
        const serverQueue = this.client.music.get(msg.guild.id);
        if(!serverQueue) return msg.send("There is nothing playing.");
        if(serverQueue.radio) return msg.send(`Now playing songs from: \`\`${serverQueue.radio}\`\``);
        if(flags) {
            if(flags.some(value => value.toLowerCase() == "image")) {
                const canvas = this.client.canvas.createCanvas(380, 124);
                const width = canvas.width;
                const height = canvas.height;
                const ctx = canvas.getContext("2d"); 
                const colors = [];
                for(const swatch of this.palette) {
                    colors.push(serverQueue.songs[0].colors[swatch].getHex());
                }

                const fonts = "Noto Sans, sans-serif";
                let fontSize = 25;

                const image = await fetch(serverQueue.songs[0].thumbnail).then(res => res.buffer());
                const resize = await sharp(image)
                    .resize(80, 80, {
                        withoutEnlargement: true,
                        fit: "contain",
                        background: {r: 0, g: 0, b: 0, alpha: 0}
                    })
                    .png()
                    .toBuffer();
            
                const img = new this.client.canvas.Image();
                img.src = resize;

                ctx.fillStyle = colors[0]; 
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = colors[2]; 
                ctx.drawImage(img, 286, 10);
                
                ctx.font = `${fontSize}px ${fonts}`, ctx.fillStyle = colors[1];
                do {
                    fontSize--;
                    ctx.font = `${fontSize}px ${fonts}`;
                } while(ctx.measureText(serverQueue.songs[0].title).width > 260);
                ctx.fillText(serverQueue.songs[0].title, 15, 35);

                fontSize = 15;
                ctx.font = `${fontSize}px ${fonts}`, ctx.fillStyle = colors[2];
                do {
                    fontSize--;
                    ctx.font = `${fontSize}px ${fonts}`;
                } while(ctx.measureText(`Requested by ${msg.guild.members.get(serverQueue.songs[0].user.id).nickname || serverQueue.songs[0].user.username}`).width > 230);
                ctx.fillText(`Requested by ${msg.guild.members.get(serverQueue.songs[0].user.id).nickname || serverQueue.songs[0].user.username}`, 15, 60);

                fontSize = 15;
                ctx.font = `${fontSize}px ${fonts}`, ctx.fillStyle = colors[1];
                const blocks = weirdBlocks(serverQueue.songs[0].time, serverQueue.connection.dispatcher.streamTime).replace(/\\/g, "");
                ctx.fillText(blocks, 15, 100);

                fontSize = 11;
                ctx.font = `${fontSize}px ${fonts}`, ctx.fillStyle = colors[2];
                ctx.fillText(`${Util.readableTime(serverQueue.connection.dispatcher.streamTime)}/${Util.readableTime(serverQueue.songs[0].time)}`, 207, 103);

                const buffer = canvas.toBuffer();
                return msg.channel.send(null, { files: [buffer]});
            } 
            if(flags.some(value => value.toLowerCase() == "thumbnail"))
                return msg.send("Thumbnail:", { files: [serverQueue.songs[0].thumbnail ]});
        }
        if (msg.channel.embedable) {
            const embed = new MessageEmbed()
                .setTitle("Now playing...")
                .setDescription(`**${serverQueue.songs[0].title}**`)
                .setURL(serverQueue.songs[0].url)
                .setAuthor(serverQueue.songs[0].user.tag, serverQueue.songs[0].user.avatarURL())
                .addField("Progress", weirdBlocks(serverQueue.songs[0].time, serverQueue.connection.dispatcher.streamTime))
                .addField("Elapsed", `${Util.readableTime(serverQueue.connection.dispatcher.streamTime)} of ${Util.readableTime(serverQueue.songs[0].time)}`, true)
                .addField("Songs in queue", serverQueue.songs.length, true)
                .setColor(serverQueue.songs[0].colors.Vibrant.getHex());
            return msg.send(null, { embed });
        }
        return msg.send(`Now playing: \`\`${serverQueue.songs[0].title}\`\` - **Requested by:** \`\`${serverQueue.songs[0].user.tag}\`\`
**Progress:** ${weirdBlocks(serverQueue.songs[0].time, serverQueue.connection.dispatcher.streamTime)}\n**Elapsed:** ${Util.readableTime(serverQueue.connection.dispatcher.streamTime)} of ${Util.readableTime(serverQueue.songs[0].time)}`);
    }
};

function weirdBlocks(duration, current) {
    const eachBlock = duration/10;
    let res = "";
    if(eachBlock < current) {
        for(let i = eachBlock; i<current; i+=eachBlock)
            res += "\\⬜️";
        if(res.length != 30) {
            while(res.length < 30)
                res += "\\⬛️";
        }
        return res;
    } else {
        return "\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️\\⬛️";
    }
}