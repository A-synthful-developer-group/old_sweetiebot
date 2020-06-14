const { Command } = require("klasa");
const longstring = require("./rules.json");

module.exports = class InternetRulesCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["rules", "rofti", "roi"], 
            description: "Tells you the rules of the internet.",
            usage: "[number:int{1,100}]",
            extendedHelp: "No extended help available."
        });    
    }
    async run(msg, [number]) {
        if (number) {
            return msg.send(`\`\`\`${longstring.rules[(parseInt(number)-1)]}\`\`\``);
        } else {
            if (msg.channel.type !== "dm") msg.send("Sent a DM with all the __**Rules of the Internet**__");
            return msg.author.send("**__Rules of the Internet:__**\n" + longstring.rules.join("\n"), {split: true});
        }
    }
};
