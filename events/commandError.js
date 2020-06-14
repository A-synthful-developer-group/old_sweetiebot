const { Event } = require("klasa");
const Util = require("../structures/Util");

module.exports = class extends Event {

    run(message, command, params, error) {
        if (error instanceof Error) this.client.emit("wtf", `[COMMAND] ${command.path}\n${error.stack || error}`);
        if (error.message) message.sendCode("JSON", Util.clean(error.message)).catch(err => this.client.emit("wtf", err));
        else message.sendMessage(Util.clean(error)).catch(err => this.client.emit("wtf", err));
    }

};