const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            enabled: false,
            description: "Checks the status from a Minecraft server",
            usage: "<str:str> <port:int>",
            usageDelim: ":",
            extendedHelp: "No extended help available."
        });
    }

    async run() {
        return;
    }
};