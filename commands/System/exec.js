const { Command, util } = require("klasa");
const snekfetch = require("snekfetch");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: "exec something.",
            usage: "<str:str>",
            permissionLevel: 10
        });
    }

    async run(msg, [str]) {
        const sent = await msg.send("Executing...");
        const responsed = await util.exec(`${str}`).catch((e) => sent.edit(e));
        if(responsed.stdout) {
            if(responsed.stdout.length > 1000) {
                snekfetch.post("https://hastebin.com/documents").send(responsed.stdout).then(body => {
                    if(!body.body.key) return sent.edit("Sorry, but I didn't receive a key from Hastebin.");
                    return sent.edit(`Sorry, but your request was so big that I had to upload it: https://hastebin.com/${body.body.key}`);
                })
                    .catch(() => sent.edit("Sorry, but an error happened with Hastebin!"));
            } else {
                return sent.edit(`\`\`\`\n${responsed.stdout}\n\`\`\``);
            }
        }
    }
};