const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const Util = require("../../structures/Util");
const fetch = require("node-fetch");
const sharp = require("sharp");
const key = require("../../auth.json").whatanime;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            aliases: ["whatanime", "nani", "trace"],
            usage: "[image:url]",
            description: "Tells you from what anime is an image",
            extendedHelp: "If you don't give an image URL it will use the most recent posted image (ignoring images sent by the bot)."
        });
    }

    async run(msg, [url]) {
        const response = await fetch((url) ? url : msg.channel.lastOtherImage).then(res => res.buffer());
        const buffer = await processImage(response);
        if(!buffer) return msg.send("This image isn't supported.");
        let encoded = buffer.toString("base64");
        if(encoded.length > 1e+6) {
            await msg.send("Trying to resize it because it's too big...");
            encoded = (await resize(buffer)).toString("base64");
            if(encoded.length > 1e+7) return msg.send("The image is bigger than 10MB, make it smaller in bit-wise size");
        }
        const sent = await msg.send("Talking to ``trace.moe``... (Might take some time)");
        const json = await fetch(`https://trace.moe/api/search?token=${key}`, {
            method: "POST",
            body: JSON.stringify({ image: `data:image/jpeg;base64,${encoded}` }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const body = await json.json();
        if(!body.docs) return msg.send(body);
        if(!body.docs[0]) return msg.send("Couldn't find something similar, sorry!");
        if(!msg.channel.embedable) {
            await sent.delete();
            return msg.send(makeNiceText(body.docs[0], msg.channel));
        }
        /*
        const thumb = await fetch(`https://trace.moe/thumbnail.php?anilist_id=${body.docs[0].anilist_id}&file=${encodeURIComponent(body.docs[0].filename)}&t=${body.docs[0].at}&token=${body.docs[0].tokenthumb}`).then(res => res.buffer());
        return msg.send(text + "\n**Found Image:**", { files: [ thumb ] });
        */
        if(msg.guild && !msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) {
            const doc = body.docs[0];
            const embed = new MessageEmbed()
                .setTitle(doc.title_native)
                .setURL(doc.mal_id ? `https://myanimelist.net/anime/${doc.mal_id}` : `https://anilist.co/anime/${doc.anilist_id}`)
                .setColor("BLACK");
                
            if(doc.mal_id) embed.addField("MyAnimeList Link", `[Link](https://myanimelist.net/anime/${doc.mal_id})`, true);
            embed.addField("AniList Link", `[Link](https://anilist.co/anime/${doc.anilist_id})`, true)
                .addBlankField(true);
            if(doc.title_romaji) embed.addField("Romaji Title", doc.title_romaji, true);
            if(doc.title_english) embed.addField("English Title", doc.title_english, true);
            if(doc.title_chinese) embed.addField("Chinese Title", doc.title_chinese, true);
            embed.addField("Episode:", doc.episode ? doc.episode : "Movie/Short", true)
                .addField("Timestamp:", Util.readableTime(doc.at*1000), true)
                .addField("Similarity", `${(doc.similarity*100).toFixed(2)}%`, true)
                .setFooter("You could have more results shown by giving the bot Manage Messages permission!");
            if(doc.similarity < 0.85) embed.setDescription("This image has a lower similarity of 85%, this is probably not what you are searching for.");
            if((doc.is_adult && !msg.channel.nsfw)) {
                embed.addField("Image is NSFW", "\u200B");
            } else {
                embed.setImage(`https://trace.moe/thumbnail.php?anilist_id=${doc.anilist_id}&file=${encodeURIComponent(doc.filename)}&t=${doc.at}&token=${doc.tokenthumb}`);
            }
            msg.send({ embed });
        }
        
        const display = new RichDisplay();
        const length = body.docs.length > 5 ? 5 : body.docs.length;
        for(let i = 0; i < length; i++) {
            const doc = body.docs[i];
            display.addPage(template => {
                template.setTitle(doc.title_native)
                    .setURL(doc.mal_id ? `https://myanimelist.net/anime/${doc.mal_id}` : `https://anilist.co/anime/${doc.anilist_id}`)
                    .setColor("BLACK");
                if(doc.mal_id) template.addField("MyAnimeList Link", `[Link](https://myanimelist.net/anime/${doc.mal_id})`, true);
                template.addField("AniList Link", `[Link](https://anilist.co/anime/${doc.anilist_id})`, true)
                    .addBlankField(true);
                if(doc.title_romaji) template.addField("Romaji Title", doc.title_romaji, true);
                if(doc.title_english) template.addField("English Title", doc.title_english, true);
                if(doc.title_chinese) template.addField("Chinese Title", doc.title_chinese, true);
                template.addField("Episode:", doc.episode ? doc.episode : "Movie/Short", true)
                    .addField("Timestamp:", Util.readableTime(doc.at*1000), true)
                    .addField("Similarity", `${(doc.similarity*100).toFixed(2)}%`, true);
                if(doc.similarity < 0.85) template.setDescription("This image has a lower similarity of 85%, this is probably not what you are searching for.");
                if((doc.is_adult && !msg.channel.nsfw)) {
                    template.addField("Image is NSFW", "\u200B");
                } else {
                    template.setImage(`https://trace.moe/thumbnail.php?anilist_id=${doc.anilist_id}&file=${encodeURIComponent(doc.filename)}&t=${doc.at}&token=${doc.tokenthumb}`);
                }    
                return template;
            });
        }
        return display.run(await sent.edit("\u200B"), {
            jump: false,
            time: 600000
        });
    }
};

async function processImage(buffer) {
    if(!Buffer.isBuffer(buffer)) return false;
    const number = buffer.toString("hex", 0, 10);
    if(/47494638([0-9a-f]{2}){6}|89504e470d0a1a0a([0-9a-f]{2}){2}|49492a00([0-9a-f]{2}){6}|4d4d002a([0-9a-f]{2}){6}/.test(number)) {
        return await sharp(buffer)
            .jpeg({
                quality: 90,
                chromaSubsampling: "4:4:4"
            })
            .toBuffer();
    } else if(/ffd8ff(e0|db|e1)([0-9a-f]{2}){6}|52494646([0-9a-f]{2}){4}5745/.test(number)) {
        return buffer;
    }
    return false;
}

function makeNiceText(info, channel) {
    if(!info) return false;
    let text = "";
    if(info.similarity < 0.85) text += "This image has a lower similarity of 85%, it's your choice to determine if it's the same anime\n";
    text += `**Anime:** ${info.title_romaji || info.title_native}
**Episode:** ${info.episode}
**Timestamp:** ${Util.readableTime(info.at*1000)}
**Similarity** ${(info.similarity*100).toFixed(2)}%
${info.mal_id ? `**MyAnimeList URL:** <https://myanimelist.net/anime/${info.mal_id}>` : `**AniList URL:** <https://anilist.co/anime/${info.anilist_id}>`}`;
    text += (info.is_adult && !channel.nsfw) ? "\nCurrent channel isn't NSFW, image won't be sent." : "";
    return text;
}

async function resize(buffer) {
    const image = await sharp(buffer);
    return await image.metadata()
        .then(metadata => {
            return image.resize(
                Math.round(metadata.width / 2),
                Math.round(metadata.height / 2), 
                { withoutEnlargement: true })
                .jpeg({
                    quality: 90,
                    chromaSubsampling: "4:4:4"
                })
                .toBuffer();
        });
}
