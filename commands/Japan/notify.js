const { Command } = require("klasa");
const malapi = require("malapi").Anime;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            subcommands: true,
            usage: "<add|delete|list> (what:what)",
            usageDelim: " ",
            description: "Notifies you if a new episode of such anime launches",
            cooldown: 10,
            enabled: false,
            extendedHelp: "what means that the argument must be:\nnothing if the first argument is list;\nif there is a MAL link and the first argument is add;\nor if there is a valid number and the first argument is delete."
        });
        this.createCustomResolver("what", (arg, possible, msg, [action]) => {
            if(action === "list") return arg;
            if(/https?:\/\/myanimelist\.net\/anime\/\d+\/?\w+ ?/.test(arg) && action === "add") return arg;
            if(!isNaN(arg) && parseInt(arg) > -1 && action === "delete") return parseInt(arg);
            throw "It must be a valid Argument";
        });
    }

    async add(msg, [str]) {
        const sent = await msg.send("Talking with a lot of things...");
        const anime = await malapi.fromUrl(str);
        const someboolean = anime.status === "Currently Airing" ? false : anime.status === "Not yet aired" ? false : true;
        if(someboolean) return sent.edit("Did you just try to make me notify you of an ended anime? Or did you just try to make me search nothing? Are you an idiot?");
        const info = this.client.economyMap.get(msg.author.id);
        let repeated = false;
        for(let i = 0; i < info.anime.length; i++) {
            if(info.anime[i] === anime.title) repeated = true;
        }
        if(repeated) return sent.edit("You already have that anime in your Notification List");
        this.client.economyMap.set(msg.author.id, info);
        return sent.edit(`Added \`\`${anime.title}\`\` to your Notification List`);
    }
    async delete(msg, [str]) {
        const info = this.client.economyMap.get(msg.author.id);
        if(info.anime.length <= str || -1 >= str) return msg.send("Sorry but that number doesn't exist in your list, why don't you check on ``s!notify list``");
        const anime = info.anime[str];
        info.anime.splice(str, 1);
        this.client.economyMap.set(msg.author.id, info);
        return msg.send(`The anime \`\`${anime}\`\` has been deleted from your Notification List`);
    }
    async list(msg) {
        const info = this.client.economyMap.get(msg.author.id);
        let message = "```asciidoc\n= Notification List =";
        for(let i = 0; i < info.anime.length; i++) {
            message += `\n${i} :: ${info.anime[i]}`; 
        }
        message += "\n```";
        return msg.send(message);
    }
};
