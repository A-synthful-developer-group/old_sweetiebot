const { Command } = require("klasa");

module.exports = class CountdownCommand extends Command {
    constructor(...args) {
        super(...args, {
            usage: "<user:user>",
            description: "Kicks that someone.",
            runIn: ["text"],
            cooldown: 5,
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [user]) {
        if(msg.member.permissions.has("KICK_MEMBERS") ) 
            return msg.send(`<@${user.id}>, you just were 👢 by <@${msg.author.id}>.`);
        return msg.send(`<@${user.id}>, some small fry (<@${msg.author.id}>) tried to 👢 you but (he/they/she) wasn't powerful enough to do it so (he/they/she) 👢 themselves.`);
    }
};