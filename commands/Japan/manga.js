const { Command, TextPrompt, Usage } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const AllHtmlEntities = require("html-entities").AllHtmlEntities;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["japanesecomic"],
            description: "Tells you about the manga you just mentioned.",
            cooldown: 7,
            usage: "<text:str>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [text]) {
        const messg = await msg.send("Asking Jikan...");
        let lol = "```\n";
        const search = await fetch(`https://api.jikan.moe/search/manga/${encodeURIComponent(text)}/1`).then(r => r.json());
        for (let i = 0; i < ((search.result.length < 11) ? search.result.length : 10); i++) 
            lol += `[${i + 1}] - ${search.result[i].title}\n`;
        lol += "```";
        await messg.delete();
        const textusage = new Usage(this.client, `<int:int{1,${search.result.length}}>`, "");
        const prompt = new TextPrompt(msg, textusage, { promptLimit: "1" });
        const [index] = await prompt.run(`Which of these mangas do you want to see?${lol}`);
        const sent = await msg.channel.send("Asking more to Jikan...");
        const body = await fetch(`https://api.jikan.moe/manga/${search.result[index-1].mal_id}/stats`).then(r => r.json());
        const nowritten = deleteWritten(body.synopsis);
        if (msg.channel.type === "dm" || msg.channel.embedable) {
            const embed = new MessageEmbed()
                .setTitle("About " + body.title + ":")
                .setDescription(nowritten)
                .setThumbnail(body.image_url)
                .setURL(body.link_canonical)
                .addField("Alternative Titles:", `${(body.title_japanese) ? `Japanese: ${body.title_japanese}` : ""}${(body.title_english) ? `\nEnglish: ${body.title_english.replaceAll("&#039;", "'")}` : ""}`, true)
                .addField("Volumes:", body.volumes, true)
                .addField("Chapters:", body.chapters, true)
                .addField("Status:", body.status, true)
                .addField(`${(body.publishing) ? "Since:" : "Dates:"}`, `${body.published_string}`, true)
                .addField("Genres:", arrayobjToStr(body.genre), true)
                .addField("Score:", body.score)
                .addField("Ranking:", `#${body.rank}`, true)
                .addField("Author:", arrayobjToStr(body.author), true)
                .setColor("GREEN");
            if(body.serialization.length > 0)
                embed.addField("Serialization:", arrayobjToStr(body.serialization), true);
            return sent.edit({embed});
        } else {
            return sent.edit(`**About ${body.title}:**\`\`\`
${nowritten}
Alternative Titles: ${(body.title_japanese) ? `\n\tJapanese: ${body.title_japanese}` : ""} ${(body.title_english) ? `\n\tEnglish: ${body.title_english.replaceAll("&#039;", "'")}` : ""}
Volumes: ${body.volumes}
Chapters: ${body.chapters}
Status: ${body.status}
${(body.publishing) ? "Since:" : "Dates:"} ${body.published_string}
Genres: ${arrayobjToStr(body.genre)}
Score: ${body.score}
Ranking: #${body.rank}
Author: ${arrayobjToStr(body.author)}${(body.serialization.length > 0) ? `
Serialization: ${arrayobjToStr(body.serialization)}` : ""}\`\`\`${body.link_canonical}`);
        }
    }
};

function deleteWritten(lines) {
    let correction = lines.replace(/\[Written by \w+ ? ?\w+ ?]|\(Source:\w+ ? ?\w+ ?\)/, "");
    return AllHtmlEntities.decode(correction);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

function arrayobjToStr(array) {
    let response;
    if(array.length > 0) { 
        if(array.length > 1) {
            response = `\n${array[0].name} - `;
            for(let i = 1; i < (array.length-1); i++)
                response += `${array[i].name} - `;
            response += `${array[array.length-1].name}`;
        } else {
            response = `${array[0].name}`;
        }
    } else {
        response = "";
    }
    return response;
}
