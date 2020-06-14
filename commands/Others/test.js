const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            description: "test",
            usage: "<test:color>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [channel]) {
        msg.send(`R:${channel.r} G:${channel.g} B:${channel.b}`);
    }
};