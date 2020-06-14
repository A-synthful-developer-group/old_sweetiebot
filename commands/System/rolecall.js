const { Command } = require("klasa");
const hardIds = ["<@181383902470864896>", "<@305243136882638858>"];

module.exports = class TimeCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 5,
            aliases: ["rollcall", "orangegay"],
            description: "only available on orange's server."
        });   
    }

    async run(msg) {
        if(msg.guild.id !== "406683099012005898") return;
        if(msg.author.id !== "181383902470864896") return msg.send("only gay oranges permitted");
        return msg.send(msg.guild.roles.get("408481252828643338").members.map((value) => `<@${value.id}>`).join(" ") + " " + hardIds.join(" ") + " Come to VC");
    }
};