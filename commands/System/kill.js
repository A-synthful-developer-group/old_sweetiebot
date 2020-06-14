const { Command } = require("klasa");

module.exports = class CountdownCommand extends Command {
    constructor(...args) {
        super(...args, {
            usage: "<user:member>",
            description: "Kills that someone.",
            runIn: ["text"],
            cooldown: 5,
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [member]) {
        const user = (member.nickname) ? member.nickname : member.user.username, me = (msg.guild.me.nickname) ? msg.guild.me.nickname : this.client.user.username;
        return msg.send(`${me}: おまえ わ もう しんでいる (I am already dead)
${user}: 何？！
\`\`FYIUUUUU ahhw ouhg awdahpahdiawhiodhaw\`\`
*${user}'s body explodes*`);
    }
};