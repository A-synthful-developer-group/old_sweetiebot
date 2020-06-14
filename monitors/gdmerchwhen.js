const { Monitor } = require("klasa");
const BigMoment = require("../structures/BigMoment");

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: "gdMerch",
            enabled: true,
            ignoreOthers: false
        });
        this.cooldowns = new Map();
    }

    async run(msg) {
        if(msg.channel.type !== "text" || msg.guild.id !== "129022124844253184" || !msg.content.toLowerCase().includes("merch when")) return;
        
        const instance = this.cooldowns.get(msg.author.id);
        if(instance) {
            const remaining = ((30000) - (Date.now() - instance)) / 1000;
            if (remaining > 0) return;
            this.cooldowns.delete(msg.author.id);
        }
        this.cooldowns.set(msg.author.id, Date.now());

        const gdmerch = this.client.things.get("gdmerch").value();

        const messages = BigInt(gdmerch.messages) + 1n,
            now = BigInt(Math.floor(Date.now()/1000)),
            lastPercentage = (BigInt(gdmerch.lastPercentage) + messages),
            rem = BigInt(gdmerch.remainder),
            duration = BigInt(gdmerch.time) - now;
        let sumDuration = (lastPercentage*duration)/100n, 
            newRem = ((lastPercentage*duration)%100n) + rem;    
        if(newRem > 99) {
            sumDuration += 1n;
            newRem -= 100n;
        }
        const newDuration = sumDuration + duration;
        await msg.send(`By mentioning It™, you have delayed It™ an additional ${BigMoment.readableTime(sumDuration)} (The imnotgoats Principle of Making It™ Go Further Away™ has increased the time by ${lastPercentage}% and the next increase of time by ${messages + 1n})\nIt™ is now ${BigMoment.readableTime(newDuration)} away.`);

        this.client.things.set("gdmerch", {
            time: (newDuration + now).toString(),
            messages: messages.toString(),
            lastPercentage: lastPercentage.toString(),
            remainder: newRem.toString()
        }).write();

        setTimeout(() => this.cooldowns.delete(msg.author.id), 10000);
    }
    init() {
        this.client.things.defaults({
            gdmerch: { 
                time: Math.floor((Date.now() + 3.154e+10)/1000).toString(), 
                messages: "0", 
                lastPercentage: "0",
                remainder: "0"
            }
        }).write();
    }
};