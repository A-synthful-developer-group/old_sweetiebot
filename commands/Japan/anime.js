const { Command, TextPrompt, Usage } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const synonyms = require("./synonyms.json");
const AllHtmlEntities = require("html-entities").AllHtmlEntities;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["animu", "japanesecartoon"],
            description: "Tells you about the anime you just mentioned.",
            cooldown: 7,
            usage: "<text:str>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [text]) {
        const messg = await msg.send("Asking Jikan...");
        let lol = "```\n";
        const search = await fetch(`https://api.jikan.moe/search/anime/${encodeURIComponent((synonyms[text.toLowerCase()] !== undefined) ? synonyms[text.toLowerCase()] : (/aaaaaaaaaaaa+?h/i.test(text) ? "Black Clover (TV)" : text))}/1`).then(r => r.json());
        for (let i = 0; i < ((search.result.length < 11) ? search.result.length : 10); i++) 
            lol += `[${i + 1}] - ${search.result[i].title}\n`;
        lol += "```";
        await messg.delete();
        const textusage = new Usage(this.client, `<int:int{1,${search.result.length}}>`, "");
        const prompt = new TextPrompt(msg, textusage, { promptLimit: "1" });
        const [index] = await prompt.run(`Which of these animes do you want to see?${lol}`);
        const sent = await msg.channel.send("Asking more to Jikan...");
        this.client.emit("log", search.result[index-1].mal_id);
        const body = await fetch(`https://api.jikan.moe/anime/${search.result[index-1].mal_id}/stats`).then(r => r.json());
        const nowritten = deleteWritten(body.synopsis);
        if (msg.channel.type === "dm" || msg.channel.embedable) {
            const embed = new MessageEmbed()
                .setTitle("About " + body.title + ":")
                .setDescription(nowritten)
                .setThumbnail(body.image_url)
                .setURL(body.link_canonical)
                .addField("Alternative Titles:", `${(body.title_japanese) ? `Japanese: ${body.title_japanese}` : ""}${(body.title_english) ? `\nEnglish: ${body.title_english.replaceAll("&#039;", "'")}` : ""}`, true)
                .addField("Episodes:", body.episodes, true)
                .addField("Type:", body.type, true)
                .addField("Status:", body.status, true)
                .addField(`${(body.airing) ? "Since:" : "Dates:"}`, `${body.aired_string}`, true)
                .addField("Genres:", arrayobjToStr(body.genre), true)
                .addField("Score:", body.score)
                .addField("Ranking:", `#${body.rank}`, true)
                .addField("Source:", body.source, true)
                .setColor("GREEN");
            if(body.studio.length > 0)
                embed.addField("Studio(s):", arrayobjToStr(body.studio), true);
            if(body.opening_theme.length > 0)
                embed.addField("Opening(s):", `${await arrayToStr(body.opening_theme, 1)}`, false);
            if(body.ending_theme.length > 0)
                embed.addField("Ending(s):", `${await arrayToStr(body.ending_theme, 1)}`, false);
            return sent.edit({embed});
        } else {
            return sent.edit(`**About ${body.title}:**\`\`\`
${nowritten}
Alternative Titles: ${(body.title_japanese) ? `\n\tJapanese: ${body.title_japanese}` : ""} ${(body.title_english) ? `\n\tEnglish: ${body.title_english.replaceAll("&#039;", "'")}` : ""}
Episodes: ${body.episodes}
Type: ${body.type}
Status: ${body.status}
${(body.airing) ? "Since:" : "Dates:"} ${body.aired_string}
Genres: ${arrayobjToStr(body.genre)}
Score: ${body.score}
Ranking: #${body.rank}
Source: ${body.source}${(body.studio.length > 0) ? `
Studio(s): ${arrayobjToStr(body.studio)}` : ""}${(body.opening_theme.length > 0) ? `
Opening(s): \n\t${await arrayToStr(body.opening_theme, 0)}` : ""}${(body.ending_theme.length > 0) ? `
Ending(s): \n\t${await arrayToStr(body.ending_theme, 0)}` : ""}\`\`\`${body.link_canonical}`);
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

async function arrayToStr(array, number) {
    const joining = ["\n\t", "\n"];
    if(array.length > 3) {
        const body = await fetch("https://api.github.com/gists/", {
            method: "POST",
            body: JSON.stringify({
                description: "things",
                public: true,
                files: {
                    "arrayToStr.vbs": {
                        content: array.join("\n").replaceAll("&#039;", "'")
                    }
                }
            }),
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
        return `[Link to Gist](${body.html_url})`;
    } else {
        return array.join(joining[number]).replaceAll("&#039;", "'");
    }
}