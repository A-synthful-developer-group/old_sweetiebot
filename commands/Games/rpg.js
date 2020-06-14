const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            description: "RPG module for SweetieBot",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        return msg.send("COMING SOON");
    }
};