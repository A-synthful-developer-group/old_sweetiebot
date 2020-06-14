const { Command } = require("klasa");
const Util = require("./../../structures/Util");

module.exports = class DanceCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["remind"],
            usage: "<time:time> <text:str>",
            usageDelim: "|",
            description: "Remind you of what you told me to remind you in an specific amount of time",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [time, text]) {
        const relativeTime = Util.moreTime(time.relative);
        await this.client.schedule.create("remind", time.absolute, {
            data: {
                content: text,
                channel: msg.channel.id,
                author: msg.author.id,
                relative: relativeTime
            },
            catchUp: true
        });
        return msg.send(`I will remind you in ${relativeTime}!`);
    }
};