const { Command, util } = require("klasa");
const fetch = require("node-fetch");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 20,
            description: "Use Nmap in this little bot.",
            usage: "[str:str]",
            permissionLevel: 10
        });
    }

    async run(msg, [str]) {
        const sent = await msg.send("Executing Nmap...");
        const responsed = await util.exec(`nmap ${str}`).catch(() => sent.edit("Are you trying to use a sudo command? 👀"));
        if(responsed.stdout) {
            if(responsed.stdout.length > 1000) {
                const body = await fetch("https://api.github.com/gists/", {
                    method: "POST",
                    body: JSON.stringify({
                        description: "nmap on " + str,
                        public: true,
                        files: {
                            "scan.txt": {
                                content: responsed.stdout
                            }
                        }
                    }),
                    headers: { "Content-Type": "application/json" }
                }).then(res => res.json());
                return sent.edit(`Sorry, but your request was so big that I had to upload it: ${body.html_url}`);
            } else {
                return sent.edit(`\`\`\`\n${responsed.stdout}\n\`\`\``);
            }
        }
    }
};