const { Command } = require("klasa");

module.exports = class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            description: (msg) => msg.language.get("COMMAND_PING_DESCRIPTION"),
        });    
    }

    async run(msg) {
        const sent = await msg.send(msg.language.get("COMMAND_PING"));
        return sent.edit(msg.language.get("COMMAND_PINGPONG", Math.round(this.client.ws.ping), sent.createdTimestamp - msg.createdTimestamp));
    }
};
