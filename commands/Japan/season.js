const { Command } = require("klasa");
const malScraper = require("mal-scraper");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            usage: "<year:int> <Summer|Spring|Winter|Fall>",
            usageDelim: " ",
            description: "Tells you info about animes in such season",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [year, season]) {
        const Season = season.charAt(0).toUpperCase() + season.slice(1);
        const sent = await msg.send (`Searching for info about ${Season} of ${year} in MAL...`);
        const seasoninfo = await malScraper.getSeason(year, season).catch(() => sent.edit("Sorry but an error happened with MAL"));
        if(seasoninfo.TV === undefined) return sent.edit("Sorry but I think the year or season you just registered doesnt exist in MAL's Database");
        return sent.edit(`\`\`\`asciidoc\n= ${Season} of ${year} =\nAnimes :: ${seasoninfo.TV.length}\nOVAs :: ${seasoninfo.OVAs.length}\nONAs :: ${seasoninfo.ONAs.length}\nMovies :: ${seasoninfo.Movies.length}\nSpecials :: ${seasoninfo.Specials.length}\n\`\`\``);
    }
};