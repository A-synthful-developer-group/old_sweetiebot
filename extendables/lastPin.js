const { Extendable } = require("klasa");
const { DMChannel, TextChannel } = require("discord.js");

module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { appliesTo: [DMChannel, TextChannel] });
    }

    get lastPin() {
        return this.client.gateways.textChannels.get(this.id).get("lastPin").split("|")[0];
    }

};