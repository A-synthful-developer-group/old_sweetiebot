const { Command } = require("klasa");
const snekfetch = require("snekfetch");
const AllHtmlEntities = require("html-entities").AllHtmlEntities;

module.exports = class LyricsCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            aliases: ["lyric"],
            usage: "<artist:str> <track:str> [line:int{1}|lyric:str]",
            usageDelim: "|",
            description: "Tells you the lyrics of the song you asked about.",
            extendedHelp: "No extended help available."  
        });
    }

    async run(msg, [artist, song, query]) {
        msg.send("Asking LyricsWiki...");
        const { body } = await snekfetch.get(`https://lyric-api.herokuapp.com/api/find/${artist}/${song}`);
        if(body.err !== "none") return msg.send(`An error happened! \`\`${body.err}\`\``);
        const splitted = body.lyric.split("\n");
        if (!query) {
            if(splitted.length > 5) {
                let text = "";
                for(let i = 0; i<5; i++) {
                    text += AllHtmlEntities.decode(splitted[i]);
                    text += "\n";
                }
                const key = await snekfetch.post("https://hastebin.com/documents").send(AllHtmlEntities.decode(body.lyric));
                text += `\nFull Lyrics: https://hastebin.com/${key.body.key}`;
                return msg.send(text);
            } else {
                return msg.send(AllHtmlEntities.decode(body.lyric));
            }
        } else if (isNaN(query)) {
            let line = -1;
            const lowerCaseQuery = query.toLowerCase();
            for (let i = 0; i<splitted.length; i++) {
                if(AllHtmlEntities.decode(splitted[i]).toLowerCase().includes(lowerCaseQuery)) {
                    line = i;
                    break;
                }
            }
            if(line == -1) return msg.send("Such query wasnt found in the lyrics.");
            if(splitted.length == 1) return msg.send(`${AllHtmlEntities.decode(splitted[0])}`);
            const key = await snekfetch.post("https://hastebin.com/documents").send(AllHtmlEntities.decode(body.lyric));
            if(line == 0) return msg.send(`${AllHtmlEntities.decode(splitted[0])}\n${AllHtmlEntities.decode(splitted[1])}${(splitted.length > 2) ? `\n\nFull Lyrics: https://hastebin.com/${key.body.key}` : ""}`);
            if(line == (splitted.length - 1)) return msg.send(`${AllHtmlEntities.decode(splitted[line - 1])}\n${AllHtmlEntities.decode(splitted[line])}\n\nFull Lyrics: https://hastebin.com/${key.body.key}`);
            return msg.send(`${AllHtmlEntities.decode(splitted[line - 1])}\n${AllHtmlEntities.decode(splitted[line])}\n${AllHtmlEntities.decode(splitted[line+1])}\n\nFull Lyrics: https://hastebin.com/${key.body.key}`);
        } else if(query <= splitted.length) {
            if(splitted.length == 1) return msg.send(`${AllHtmlEntities.decode(splitted[0])}`);
            const key = await snekfetch.post("https://hastebin.com/documents").send(AllHtmlEntities.decode(body.lyric));
            if(query == 1) return msg.send(`${AllHtmlEntities.decode(splitted[0])}\n${AllHtmlEntities.decode(splitted[1])}${(splitted.length > 2) ? `\n\nFull Lyrics: https://hastebin.com/${key.body.key}` : ""}`);
            if(query == splitted.length) return msg.send(`${AllHtmlEntities.decode(splitted[query-2])}\n${AllHtmlEntities.decode(splitted[query-1])}\n\nFull Lyrics: https://hastebin.com/${key.body.key}`);
            return msg.send(`${AllHtmlEntities.decode(splitted[query-2])}\n${AllHtmlEntities.decode(splitted[query-1])}\n${AllHtmlEntities.decode(splitted[query])}\n\nFull Lyrics: https://hastebin.com/${key.body.key}`);
        } else {
            return msg.send(`The integer you gave was invalid because the amounts of lines in the lyrics are 1${(splitted.length > 1) ? `-${splitted.length}` : ""}.`);
        }
    }
};