const { Command } = require("klasa");
const Util = require("./../../structures/Util");

module.exports = class CountdownCommand extends Command {
    constructor(...args) {
        super(...args, {
            usage: "<time:time> <text:str>",
            usageDelim: "|",
            permissionLevel: 6,
            description: "Makes a countdown.",
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [time, text]) {
        const sent = await msg.send(`${Util.readableTime(time.relative)} remaining for countdown to finish!`);
        const schedule = await this.client.schedule.create("count", "* * * * *", {
            data: {
                message: sent.id,
                text: text,
                channel: msg.channel.id,
                time: time.absolute
            },
            catchUp: true
        });
        return await this.client.schedule.create("kill", time.absolute + 120000, {
            data: {
                id: schedule.id
            },
            catchUp: true
        });
    }
};