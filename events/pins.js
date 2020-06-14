const { Event } = require("klasa");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: "channelPinsUpdate",
        });
    }

    async run(channel) {
        const config = this.client.gateways.textChannels.get(channel.id);
        const pinned = (await channel.messages.fetchPinned()).first();
        const lastPin = config.get("lastPin").split("|");
        if(lastPin[0] == pinned.id) return;
        if(lastPin[1])
            if(parseInt(lastPin[1]) > pinned.createdTimestamp) return;
        await config.update("lastPin", `${pinned.id}|${pinned.createdTimestamp}`);
    }

};