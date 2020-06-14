const { Monitor } = require("klasa");

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            enabled: true,
            ignoreBots: false,
            ignoreSelf: false,
            ignoreOthers: false,
            ignoreWebhooks: false,
            ignoreBlacklistedUsers: false
        });
    }

    async run(msg) {
        const image = msg.attachments.last();
        if(!image) return;
        if(!image.height) return;
        const settings = this.client.gateways.textChannels.get(msg.channel.id);
        if(msg.author.id == this.client.user.id) {
            return settings.update({ lastSelfImage: image.url, lastSelfImageTime: msg.createdTimestamp});
        }
        return settings.update({ lastOtherImage: image.url, lastOtherImageTime: msg.createdTimestamp});
    }
};
