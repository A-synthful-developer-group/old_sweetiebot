const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

module.exports = class SayCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["guild", "svr", "serverinfo", "guildinfo", "svrinfo"],
            cooldown: 4,
            description: "Tells you about the server.",
            extendedHelp: "No extended help available."                
        });
        this.verificationLevel = [
            "None, this is very insecure", 
            "Low, at least you need to be verified",
            "Medium, well I don't like waiting 5 minutes",
            "(╯°□°）╯︵ ┻━┻, you will need to wait 10 minutes ***yay***",
            "┻━┻ 彡 ヽ(ಠ益ಠ)ノ彡┻━┻, TOO MUCH VERIFICATION! THIS IS TOO SAFE!"
        ];
    }

    async run(msg) {
        if(msg.channel.type == "dm") return msg.send("This isn't a guild/server, you silly!");
        if(!msg.channel.embedable) return msg.send("I can't post embeds if you don't give me permissions for such thing 👀");
        const embed = new MessageEmbed()
            .addField("Channels", msg.guild.channels.array().length, true)
            .addField("Users", msg.guild.memberCount, true)
            .addField("Large?", msg.guild.large, true);

        if(msg.guild.defaultChannel) embed.addField("Default Channel", msg.guild.defaultChannel, true);

        embed.addField("Region", msg.guild.region, true);
        embed.addField("Owner", msg.guild.owner.user, true);
        embed.addField("Created at", msg.guild.createdAt.toDateString(), true);
        embed.addField("Verification Lvl:", this.verificationLevel[msg.guild.verificationLevel], true);

        const emojis = [];
        let whyAmIDoingThis = "";
        for(const [,data] of msg.guild.emojis) {
            if(emojis.join(" ").length + data.toString().length > 1024) {
                embed.addField(whyAmIDoingThis + "Emojis", emojis.join(" "));
                emojis.splice(0);
                whyAmIDoingThis += "More ";
            }
            emojis.push(data.toString());
        }
        if(emojis.length > 0) embed.addField(whyAmIDoingThis + "Emojis", emojis.join(" "));
            
        const roles = [];
        whyAmIDoingThis = "";
        for(const [,data] of msg.guild.roles) {
            if(roles.join(" ").length + data.toString().length > 1024) {
                embed.addField(whyAmIDoingThis + "Roles", roles.join(" – "));
                roles.splice(0);
                whyAmIDoingThis += "More ";
            }
            roles.push(data.toString());
        }
        if(roles.length > 0) embed.addField(whyAmIDoingThis + "Roles", roles.join(" – "));

        embed.setColor("RED");
        embed.setThumbnail(msg.guild.iconURL({options:{format:"jpg"}}));
        msg.send(`**General information about ${msg.guild.name}**`, {embed});
    }
};

