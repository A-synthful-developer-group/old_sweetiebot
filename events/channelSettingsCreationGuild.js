const { Event } = require("klasa");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: "guildCreate"
        });
    }

    async run(guild) {
        const settingsSynced = [];
        for (const [id] of guild.channels.filter(c => c.type === "text")) {
            const settings = this.client.gateways.textChannels.get(id, true);
            this.client.gateways.textChannels.cache.set(id, { settings });
            settingsSynced.push(settings.sync());
        }
        return Promise.all(settingsSynced);
    }   
};
