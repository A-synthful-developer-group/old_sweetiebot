const { Event } = require("klasa");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: "channelCreate"
        });
    }

    async run(channel) {
        if(/voice|category/.test(channel.type)) return;
        const settings = this.client.gateways.textChannels.get(channel.id, true);
        this.client.gateways.textChannels.cache.set(channel.id, { settings });
        return settings.sync();
    }   
};
