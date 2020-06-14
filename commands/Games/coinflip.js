const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["flip", "flipcoin"],
            description: "Makes you bet for an amount of money in a coin-flipping game",
            cooldown: 5,
            usage: "<head|tail> <money:float{0}>",
            usageDelim: " ",
            extendedHelp: "No extended help available.",
            enabled: false
        });    
    }

    async run(msg, [face, money]) {
        const info = this.client.economyMap.get(msg.author.id);
        const random01 = Math.round(Math.random());
        if (info.satbit) {
            if (money > info.wallet*0.00000001) return msg.send("You don't have enough money, try betting a little lower.");
            if(face === "head") {
                if(random01 === 0) {
                    info.wallet += money/0.00000001;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You won! You got ${money*2} BTC.`);
                } else {
                    info.wallet -= money/0.00000001;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You lost... you lose ${money} BTC.`);
                }
            }
            if(face === "tail" ) {
                if(random01 === 0) {
                    info.wallet -= money/0.00000001;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You lost... you lose ${money} BTC.`);
                } else {
                    info.wallet += money/0.00000001;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You won! You got ${money*2} BTC.`);
                }
            }
        } else {
            if (money > info.wallet) return msg.send("You don't have enough money, try betting a little lower.");
            if(face === "head") {
                if(random01 === 0) {
                    info.wallet += money;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You won! You got ${money*2} Satoshi.`);
                } else {
                    info.wallet -= money;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You lost... you lose ${money} Satoshi.`);
                }
            }
            if(face === "tail" ) {
                if(random01 === 0) {
                    info.wallet -= money;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You lost... you lose ${money} Satoshi.`);
                } else {
                    info.wallet += money;
                    this.client.economyMap.set(msg.author.id, info);
                    msg.send(`You won! You got ${money*2} Satoshi.`);
                }
            }
        }
    }
};
