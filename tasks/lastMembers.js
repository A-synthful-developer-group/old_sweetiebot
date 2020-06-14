const { Task } = require("klasa");

module.exports = class extends Task {

    async run() {
        for(const [key, value] of this.client.guilds) {
            const settings = this.client.gateways.guilds.get(key);
            await settings.update("lastMemberCount", { count: value.memberCount, timestamp: Date.now()});
        }
    }

    init() {
        if(!this.client.gateways.guilds.schema.has("lastMemberCount"))
            this.client.gateways.guilds.schema.add("lastMemberCount", "integer", { array: true });
    }   
};