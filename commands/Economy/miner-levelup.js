const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "miner-levelup",
            cooldown: 15,
            aliases: ["mine-levelup", "levelup"],
            description: "Level up your miner! Be wary it will cost you something!",
            usage: "[max|amount:int{1}]",
            enabled: false,
            extendedHelp: "You can use an argument that levels up a quantity of levels with an integer (number) or all the levels you can level up with saying max."
        });
    }
    async run(msg, [amount]) {
        const info = this.client.economyMap.get(msg.author.id);
        if (typeof amount === "string" && info.wallet >= 5000*info.miner) {
            let cost = 5000*info.miner;
            let mined = 1;
            let lastCost;
            while(cost < info.wallet) {
                cost += 5000*(info.miner + mined);
                lastCost = 5000*(info.miner + mined);
                mined += 1;
            }
            info.miner += mined - 1;
            info.wallet -= cost - lastCost;
            this.client.economyMap.set(msg.author.id, info);
            const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
            const satoshi = Math.floor(body.coins_per_hour/0.00000001);
            const embed = new MessageEmbed()
                .setTitle("Congratulations, you leveled up your miner!")
                .setDescription("Your new stats are:")
                .addField("Miner level:", info.miner, true)
                .addField("Amount of levels:", mined-1, true)
                .addField("tH/s:", `${1.28*info.miner}tH/s`, true)
                .addField("Satoshi/h:", `${satoshi} Satoshi/h`,true)
                .setColor(getRandomColor());
            return msg.send(null, { embed });
        }
        if (typeof amount === "number") {
            if (amount === 1 && info.wallet >= 5000*info.miner) {
                info.wallet -= 5000*info.miner;
                info.miner += 1;
                this.client.economyMap.set(msg.author.id, info);
                const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
                const satoshi = Math.floor(body.coins_per_hour/0.00000001);
                const embed = new MessageEmbed()
                    .setTitle("Congratulations, you leveled up your miner!")
                    .setDescription("Your new stats are:")
                    .addField("Miner level:", info.miner, true)
                    .addField("Amount of levels:", "1 (why?)", true)
                    .addField("tH/s:", `${1.28*info.miner}tH/s`, true)
                    .addField("Satoshi/h:", `${satoshi} Satoshi/h`,true)
                    .setColor(getRandomColor());
                return msg.send(null, { embed });
            } else if (amount === 1) {
                if(info.satbit) return msg.send(`You need to get ${(0.00000001 * (info.miner*5000)) - info.wallet}/${0.00000001*(info.miner*5000)} BTC to level up`, {reply: msg});
                return msg.send(`You need to get ${(info.miner*5000)}/${(info.miner*5000) - info.wallet} Satoshi to level up`, {reply: msg});
            }
            let cost = 5000*info.miner;
            let mined = 1;
            let lastCost;
            while(cost < info.wallet && mined <= amount) {
                cost += 5000*(info.miner + mined);
                lastCost = 5000*(info.miner + mined);
                mined += 1;
            }
            mined -= 1;
            cost -= lastCost;
            if(cost < info.wallet && amount === mined) {
                info.wallet -= cost;
                info.miner += mined;
                this.client.economyMap.set(msg.author.id, info);
                const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
                const satoshi = Math.floor(body.coins_per_hour/0.00000001);
                const embed = new MessageEmbed()
                    .setTitle("Congratulations, you leveled up your miner!")
                    .setDescription("Your new stats are:")
                    .addField("Miner level:", info.miner, true)
                    .addField("Amount of levels:", mined, true)
                    .addField("tH/s:", `${1.28*info.miner}tH/s`, true)
                    .addField("Satoshi/h:", `${satoshi} Satoshi/h`,true)
                    .setColor(getRandomColor());
                return msg.send(null, { embed });
            } else {
                return msg.send("Sorry! But you've asked too much of your wallet.", {reply: msg});
            }
        }
        if (info.wallet >= 5000*info.miner) {
            info.wallet -= 5000*info.miner;
            info.miner += 1;
            this.client.economyMap.set(msg.author.id, info);
            const { body } = await snekfetch.get(`http://alloscomp.com/bitcoin/calculator/json?hashrate=${info.miner*1280000000000}`);
            const satoshi = Math.floor(body.coins_per_hour/0.00000001);
            const embed = new MessageEmbed()
                .setTitle("Congratulations, you leveled up your miner!")
                .setDescription("Your new stats are:")
                .addField("Miner level:", info.miner, true)
                .addField("tH/s:", `${1.28*info.miner}tH/s`, true)
                .addField("Satoshi/h:", `${satoshi} Satoshi/h`,true)
                .setColor(getRandomColor());
            return msg.send(null, { embed });
        } else {
            if(info.satbit) return msg.send(`You need to get ${(0.00000001 * (info.miner*5000)) - info.wallet}/${0.00000001*(info.miner*5000)} BTC to level up`, {reply: msg});
            return msg.send(`You need to get ${(info.miner*5000)}/${(info.miner*5000) - info.wallet} Satoshi to level up`, {reply: msg});
        }
    }
};
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
