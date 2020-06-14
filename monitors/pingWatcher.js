const { Monitor } = require("klasa");

module.exports = class extends Monitor {
    
    constructor(...args) {
        super(...args, {
            name: "pingWatcher",
            enabled: true,
            ignoreBots: false,
            ignoreSelf: false,
            ignoreOthers: false
        });
    }
    async run(msg) {
        const settings = msg.author.settings;
        const mentionsAmount = (msg.content.match(/<@&(\d{17,19})>|<@!?(1|\d{17,19})>|@(everyone|here)/g) || []).length;
        if(mentionsAmount > 0) {
            const mentions = settings.get("pings");
            await settings.update({ pings: mentions + mentionsAmount });
            this.client.emit("log", `Added ${mentionsAmount} ping(s) to ${msg.author.tag}`);
        }
    }
};
