const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Creates a roulette game on the channel.",
            cooldown: 45,
            extendedHelp: "No extended help available.",
            enabled: false
        });    
    }

    async run(msg) {
        if(this.client.rouletteChannels.has(msg.channel.id)) {
            msg.send("There is already a roulette game on this channel, join the game by doing ``s!roulette-join <option> <money-for-bet>``.", {reply: msg});
        } else {
            const regexp = /^red$|^black$|^odd$|^even$|^1st$|^2nd$|^3rd$|^1-12$|^13-24$|^25-36$|^1-18$|^19-36$|^(?:[0-9]|[1-2][0-9]|3[0-6])$/i;
            const filter = (m => {
                if(m.content.toLowerCase().startsWith("s!roulette-join ")) {
                    const splitted = m.content.split(" ");
                    const info = this.client.economyMap.get(m.author.id);
                    if(regexp.test(splitted[2]) && isNaN(splitted[3]) && parseFloat(splitted[3]) <= info.wallet) {
                        info.wallet -= parseFloat(splitted[3]);
                        this.client.economyMap.set(m.author.id, info);
                        m.send(`You were added to the the roulette gamblers on this channel with the next options:\nBet for: ${splitted[2]}\nMoney: ${splitted[3]} You cant join in any other roulette now.`, {reply: m});
                        return true;
                    }
                }
                return false;
            });
            this.client.rouletteChannels.add(msg.channel.id);
            const collector = await msg.channel.awaitMessages(filter, {time: 45000});
            if(collector.first()) {
                Math.round(Math.random()*36);
            } else {
                msg.send("Nobody joined the roulette game.");
            }
            this.client.rouletteChannels.delete(msg.channel.id);
        }
    }
    async init() {
        this.client.rouletteChannels = new Set();
        this.client.emit("log", "Set of Channels that have roulette active has been created!");
    }
};
