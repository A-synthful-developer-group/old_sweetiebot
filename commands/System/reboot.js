const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["die", "shutdown", "shutup", "bye"],
            permissionLevel: 10,
            description: (msg) => msg.language.get("COMMAND_REBOOT_DESCRIPTION")
        });
    }

    async run(msg) {
        const sent = await msg.send(msg.language.get("COMMAND_REBOOT")).catch(err => this.client.emit("error", err));
        await sent.edit(msg.language.get("COMMAND_REBOOT_END"));
        this.client.vndb.end();
        process.exit();
    }

};
