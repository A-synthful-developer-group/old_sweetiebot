const { Extendable } = require("klasa");
const { DMChannel, TextChannel } = require("discord.js");


module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { appliesTo: [DMChannel, TextChannel] });
    }

    get lastImage() {
        const conf = this.client.gateways.textChannels.get(this.id);
        const isOtherNewer = conf.get("lastOtherImageTime") >= conf.get("lastSelfImageTime");
        return conf.get(`last${isOtherNewer ? "Other" : "Self"}Image`);
    }

    get lastOtherImage() {
        return this.client.gateways.textChannels.get(this.id).get("lastOtherImage");
    }

    get lastSelfImage() {
        return this.client.gateways.textChannels.get(this.id).get("lastSelfImage");
    }

};