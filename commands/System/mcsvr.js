const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const Compute = require("@google-cloud/compute");
const compute = new Compute({
    keyFilename: `${require("os").homedir()}/My First Project-a5540bfe2faf.json`
});
const zone = compute.zone("southamerica-east1-b");
const vm = zone.vm("minecraft");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            subcommands: true,
            cooldown: 10,
            description: "minecraft server access <just for owner>.",
            usage: "<stop|start|status>",
            runIn: ["text"]
        });
    }
    
    async start(msg) {
        if(msg.guild.id !== "482708643826106369") return;
        const [ vmData ] =  await vm.getMetadata();
        if(vmData.status === "RUNNING")
            return msg.send("The server is running, you idiot.");
        const sent = await msg.send("Starting server...");
        const [ vmStartData ] =  await vm.start();
        if(vmStartData.status !== "DONE")
            return sent.edit("idk what happened");
        sent.edit("Server has been started.");
    }

    async stop(msg) {
        if(msg.guild.id !== "482708643826106369") return;
        const [ vmData ] =  await vm.getMetadata();
        if(vmData.status === "TERMINATED")
            return msg.send("The server is already terminated, you blockhead.");
        const sent = await msg.send("Stopping server...");
        const [ vmStopData ] =  await vm.stop();
        if(vmStopData.status !== "DONE")
            return sent.edit("idk what happened");
        sent.edit("Server has been stopped.");
    }

    async status(msg) {
        if(msg.guild.id !== "482708643826106369") return;
        const sent = await msg.send("Getting data about the server...");
        const [ vmData ] =  await vm.getMetadata();
        const embed = new MessageEmbed()
            .setColor((vmData.status === "RUNNING") ? "GREEN" : ((vmData.status === "TERMINATED") ? "RED" : "YELLOW"))
            .setTitle(vmData.name)
            .setDescription(`The current IP is: ${vmData.networkInterfaces[0].accessConfigs[0].natIP}`);
        if(vmData.status === "TERMINATED")
            return sent.edit(null, { embed });
        const [ serialOutput ] =  await vm.getSerialPortOutput(), arrayOfInfo = serialOutput.split("\r\n");
        embed.addField("Serial Output", `\`\`\`
${arrayOfInfo[arrayOfInfo.length - 8]} 
${arrayOfInfo[arrayOfInfo.length - 7]}
${arrayOfInfo[arrayOfInfo.length - 6]}
${arrayOfInfo[arrayOfInfo.length - 5]}
${arrayOfInfo[arrayOfInfo.length - 4]}
${arrayOfInfo[arrayOfInfo.length - 3]}
${arrayOfInfo[arrayOfInfo.length - 2]} 
${arrayOfInfo[arrayOfInfo.length - 1]}     
\`\`\``);
        sent.edit(null, { embed });
    }

};