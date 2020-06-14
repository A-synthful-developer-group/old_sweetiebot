const { Task } = require("klasa");
const Util = require("./../structures/Util");

module.exports = class extends Task {

    async run({ channel, message, time, text }) {
        const durationMil = time - Date.now();
        try {
            const _channel = this.client.channels.get(channel), _message = await _channel.messages.fetch(message);
            if(durationMil > 60000) return await _message.edit(`${Util.readableTime(durationMil)} left for countdown to finish!`);
            setTimeout(async function() {
                await _message.delete();
                return await _channel.send(`Countdown has finished! ${text.trim()}`);
            }, durationMil);
            return this.client.emit("log", `Made a timeout for countdown in ${channel} channel!`);
        } catch(e) {
            if(durationMil < 0) return;
            return this.client.emit("error", `An error ocurred on ${channel} channel:\n${e}`);
        }
    }

};