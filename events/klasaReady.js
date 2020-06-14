const { Event } = require("klasa");
const { tasks, fontFamilies } = require("../config.json");
const Util = require("../structures/Util");
const authDetails = require("../auth.json");
const canvas = require("canvas");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    async run() {
        for(const value of tasks)
            if(!this.client.schedule.tasks.some(task => task.taskName === value.taskName))
                this.client.schedule.create(value.taskName, value.cron);

        const settingsSynced = [];
        for (const [id] of this.client.channels.filter(c => c.type === "text")) {
            const settings = this.client.gateways.textChannels.get(id, true);
            this.client.gateways.textChannels.cache.set(id, { settings });
            settingsSynced.push(settings.sync());
        }
        await Promise.all(settingsSynced);
        this.client.emit("log", "All channels have been synced");

        for(const fontFamily of fontFamilies) {
            for(const font of fontFamily.fonts)
                canvas.registerFont(`${this.client.userBaseDirectory}/fonts/${font}`, { family: fontFamily.name });
            this.client.emit("log", `Registered the ${fontFamily.name} font family on node-canvas`);
        }
        this.client.canvas = canvas;

        const patternsForSensitivity = [];
        for(const authDetail of Object.values(authDetails)) {
            if(authDetail instanceof Object) {
                for(const moreAuthDetail of Object.values(authDetail)) 
                    patternsForSensitivity.push(moreAuthDetail);
                continue;
            }
            patternsForSensitivity.push(authDetail);
        }
        Util.changePatterns(patternsForSensitivity);
    }   
};
