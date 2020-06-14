const { Command, util } = require("klasa");
const Util = require("../../structures/Util");
const authDetails = require("../../auth.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["pull"],
            permissionLevel: 10,
            description: "Updates the bot."
        });
    }

    async run(msg) {
        const sent = await msg.send("Updating code...");
        const responsed = await util.exec(`git pull https://${authDetails.github.user}:${authDetails.github.password}@github.com/ImUrX/sweetiebot-klasa.git`);
        const decoded = responsed.stdout.toString("utf8");
        if(decoded.includes("Already up-to-date.")) return sent.edit("The code is already up-to-date!");
        await sent.edit(`Code has been updated!\`\`\`\n${Util.clean(responsed.stdout)}\n\`\`\``);
        if(decoded.includes("package.json")) {
            const senttwo = await msg.channel.send("BUT WAIT, THERE IS MORE... package.json update detected! Launching NPM...");
            const npm = await util.exec("npm install");
            await senttwo.edit(`New packages and updates have been installed!\`\`\`\n${npm.stdout}\n\`\`\``);
        }
        process.exit();
    }
};