const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

module.exports = class UserCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["whois", "usr"],
            runIn: ["text"],
            description: "Tells you about the user you mentioned.",
            cooldown: 2,
            usage: "[Member:member]",
            usageDelim: " ",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [text]) {
        if (!text) {
            const settings = msg.author.settings;
            const embed = new MessageEmbed()
                .addField("Username:", msg.author.username, true)
                .addField("Discriminator:", msg.author.discriminator, true)
                .addField("Discord ID:", msg.author.id, true);
            if (msg.author.bot) embed.addField("Are they going to kill us? (Bot):", msg.author.bot, true);
            embed.addField("Created at:", msg.author.createdAt.toDateString(), false);
            embed.addField("Joined at:", msg.guild.members.get(msg.author.id).joinedAt.toDateString());
            embed.addField("Current roles:", msg.guild.members.get(msg.author.id).roles.array().join(" – "), true);
            if(settings.pings > 0) {
                embed.addField("Pings:", settings.pings);
            } else {
                embed.addField("Pings:", "Wow, you haven't mentioned anyone... \n...yet."); //or "...yet" might make more sense --Ako. ok --uriel
            }
            embed.setThumbnail(msg.author.avatarURL({options:{format:"jpg"}}));
            embed.setColor("BLUE");
            return msg.send("**About you:**", { embed });
        } else {
            const settings = text.user.settings;
            const embed = new MessageEmbed()
                .addField("Username:", text.user.username, true)
                .addField("Discriminator:", text.user.discriminator, true)
                .addField("Discord ID:", text.id, true);
            if (text.user.bot) embed.addField("Are they going to kill us? (Bot):", text.user.bot, true);
            embed.addField("Created at:", text.user.createdAt.toDateString(), false);
            embed.addField("Joined at:", text.joinedAt.toDateString());
            embed.addField("Current roles:", text.roles.array().join(" – "), true);
            if(settings.pings > 0) {
                embed.addField("Pings:", settings.pings);
            } else {
                embed.addField("Pings:", "Wow, they haven't mentioned anyone... \n...yet.");
            }
            embed.setThumbnail(text.user.avatarURL({options:{format:"jpg"}}));
            embed.setColor("BLUE");
            return msg.send(`**About ${text.user.tag}:**`, { embed });
        }
    }
};
