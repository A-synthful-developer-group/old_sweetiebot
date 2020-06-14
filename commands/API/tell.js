const { Command } = require("klasa");
const { parseString } = require("./../../structures/Util");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const authDetails = require("../../auth.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 30,
            aliases: ["wolfram", "wolframalpha"],
            description: "Uses Wolfram to answer the question",
            usage: "<text:str>",
            extendedHelp: "No extended help available."
        });
    }
    async run(msg, [text]) {
        const sent = await msg.send("Asking Wolfram...");
        const getURL = input => `https://api.wolframalpha.com/v2/query?input=${input}&appid=${authDetails.wolfram}`;
        const url = getURL(encodeURIComponent("tell " + text));
        const result = await fetch(url).then(r => r.text()).then(text => parseString(text));
        let lol = "";
        if(result.queryresult.$.success == "true") {
            if(result.queryresult.warnings) {
                for(let j in result.queryresult.warnings) {
                    for(let n in result.queryresult.warnings[j]){
                        if(n != "$") {
                            lol += (result.queryresult.warnings[j][n][0].$.text);
                        }
                    }
                }
            }
            if(result.queryresult.assumptions) {
                for(let j in result.queryresult.assumptions){
                    for(let n in result.queryresult.assumptions[j]){
                        if(n != "$"){
                            lol += (`\nThinking ${result.queryresult.assumptions[j][n][0].$.word} is ${result.queryresult.assumptions[j][n][0].value[0].$.desc}`);
                        }
                    }
                }
            }
            if (result.queryresult.pod.length > 2) {
                lol += "```\n\t\t\t\tCurrent options for " + result.queryresult.pod[0].subpod[0].plaintext[0];
                for (let j in result.queryresult.pod) {
                    if (j > 0) {
                        lol += `\n[${j}]\t\t${result.queryresult.pod[j].$.title}`;
                    }
                }
                lol += "\n```To choose an option, reply with the number of the option.";
                sent.edit(lol);
                const filter = (m => msg.author.id === m.author.id && !(isNaN(m.content)) && parseInt(m.content) > 0 && parseInt(m.content) < result.queryresult.pod.length);
                const m = await msg.channel.awaitMessages(filter, { max: 1, time:25000, errors: ["time"] })
                    .then(collected => collected.first())
                    .catch(collected => collected.first());
                if(m === undefined) {
                    sent.edit("Timeout! You didn't respond in time (25 seconds).");
                } else {
                    let number = parseInt(m.content);
                    if (result.queryresult.pod[number].subpod[0].plaintext[0] === "") {
                        if (m.channel.type == "dm" || m.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
                            const embed = new MessageEmbed();
                            embed.setImage(result.queryresult.pod[number].subpod[0].img[0].$.src);
                            embed.setColor("ORANGE");
                            embed.setFooter("Image provided by Wolfram|Alpha", "http://www.symbols.com/gi.php?type=1&id=2886&i=1");
                            m.send(null, {embed});
                        } else {
                            m.send(result.queryresult.pod[number].subpod[0].img[0].$.src);
                        }
                    } else {
                        let message = `**${result.queryresult.pod[number].$.title}**\`\`\``;
                        for(let b=0; b<result.queryresult.pod[number].subpod.length; b++) {
                            message += `\n${result.queryresult.pod[number].subpod[b].plaintext[0]}`;
                        }
                        message += "\n```";
                        if(message.length > 1900) {
                            let text;
                            for(let b=0; b<result.queryresult.pod[number].subpod.length; b++) {
                                text = `\n${result.queryresult.pod[number].subpod[b].plaintext[0]}`;
                            }
                            const body = await fetch("https://api.github.com/gists/", {
                                method: "POST",
                                body: JSON.stringify({
                                    description: result.queryresult.pod[number].$.title,
                                    public: true,
                                    files: {
                                        "wolfram_response.txt": {
                                            content: text
                                        }
                                    }
                                }),
                                headers: { "Content-Type": "application/json" }
                            }).then(res => res.json());
                            return m.send(body.html_url);
                        } else { 
                            return m.send(message);
                        }
                    }
                }
            } else if (result.queryresult.pod.length < 3) {
                if(result.queryresult.pod[1].subpod[0].plaintext[0] === "") {
                    if (sent.channel.type == "dm" || sent.channel.permissionsFor(this.client.user).has("EMBED_LINKS")) {
                        const embed = new MessageEmbed();
                        embed.setImage(result.queryresult.pod[1].subpod[0].img[0].$.src);
                        embed.setColor("ORANGE");
                        embed.setFooter("Image provided by Wolfram|Alpha", "http://www.symbols.com/gi.php?type=1&id=2886&i=1");
                        return sent.edit(lol, { embed });
                    } else {
                        lol += result.queryresult.pod[1].subpod[0].img[0].$.src;
                    }
                } else {
                    if(result.queryresult.pod[1].subpod[0].plaintext.length > 1900) {
                        const body = await fetch("https://api.github.com/gists/", {
                            method: "POST",
                            body: JSON.stringify({
                                description: result.queryresult.pod[1].$.title,
                                public: true,
                                files: {
                                    "wolfram_response.txt": {
                                        content: result.queryresult.pod[1].subpod[0].plaintext
                                    }
                                }
                            }),
                            headers: { "Content-Type": "application/json" }
                        }).then(res => res.json());
                        lol +=(`${result.queryresult.pod[1].$.title}: ${body.html_url}`);
                    } else {
                        lol += `${result.queryresult.pod[1].$.title}:\`\`\`\n\n${result.queryresult.pod[1].subpod[0].plaintext}\n\`\`\``;
                    }
                }
                return sent.edit(lol);
            } else if (result.queryresult.didyoumeans){
                let mass = [];
                for(let i in result.queryresult.didyoumeans){
                    for(let j in result.queryresult.didyoumeans[i].didyoumean) {
                        mass.push(result.queryresult.didyoumeans[i].didyoumean[j]._);
                    }
                }
                return sent.edit("Did you mean: " + mass.join(" "));
            }
        } else {
            return sent.edit("Not found, try asking a different way.");
        }
    }
};