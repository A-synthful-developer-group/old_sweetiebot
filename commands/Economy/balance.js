const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["bal"],
            description: "Replies you with your current bitcoin balance",
            cooldown: 5,
            usage: "[User:user]",
            extendedHelp: "No extended help available.",
            enabled: false
        });    
    }

    async run(msg, [text]) {
        if(text) {
            const info = this.client.economyMap.get(text.id);
            if (info) {
                msg.send(`The curent balance of ${text.username} is ${info.wallet} Satoshi.`);
            }
        } else {
            const info = this.client.economyMap.get(msg.author.id);
            msg.send(`Your current balance is ${info.wallet} Satoshi.`);
        }
    }

};