const { Command, util } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 5,
            description: "countdown for an special orange.",
            aliases: ["orange", "minicount"]
            //i hope razz dies
        });
        this.deletedMessages = ["is ", "is mega ", "is ultra ", "is super ", "has big ", "ur mom ", "ur grandma "];
    }

    async run(msg) {
        const sent = await msg.send("10");
        try {
            await util.sleep(900);
            await sent.edit("9");
            await util.sleep(900);
            await sent.edit("8");
            await util.sleep(900);
            await sent.edit("7");
            await util.sleep(900);
            await sent.edit("6");
            await util.sleep(900);
            await sent.edit("5");
            await util.sleep(900);
            await msg.channel.send("4");
            await util.sleep(900);
            await msg.channel.send("3");
            await util.sleep(900);
            await msg.channel.send("2");
            await util.sleep(900);
            await msg.channel.send("1");
            await util.sleep(900);
            if(Math.floor(Math.random() * 19) === 13) {
                await msg.channel.send("2");
                await msg.channel.send("3");
                await util.sleep(900);
                await msg.channel.send("4");
                await util.sleep(900);
                const sent2 = await msg.channel.send("5");
                await util.sleep(900);
                await sent2.edit("6");
                await util.sleep(900);
                await sent2.edit("7");
                await util.sleep(900);
                await sent2.edit("8");
                await util.sleep(900);
                await sent2.edit("9");
                await util.sleep(900);
                await sent2.edit("10");
                await util.sleep(900);
                await sent2.edit("9");
                await util.sleep(900);
                await sent2.edit("8");
                await util.sleep(900);
                await sent2.edit("7");
                await util.sleep(900);
                await sent2.edit("6");
                await util.sleep(900);
                await sent2.edit("5");
                await util.sleep(900);
                await msg.channel.send("4");
                await util.sleep(900);
                await msg.channel.send("3");
                await util.sleep(900);
                await msg.channel.send("2");
                await util.sleep(900);
                await msg.channel.send("1");
                await util.sleep(900);
            } 
            return msg.channel.send("GO!");
        } catch (e) {
            if(sent.deleted) return msg.send("whoever deleted the message " + this.deletedMessages[Math.floor(Math.random()*this.deletedMessages.length)] + "gay");
        }
    }
};