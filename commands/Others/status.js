const { Command } = require("klasa");
const httpcode = require("./httpcodes.json");

module.exports = class StatusCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["status-http"],
            description: "Tells you what the HTTP code means.",
            usage: "<number:str>",
            extendedHelp: "No extended help available."
        });    
    }

    async run(msg, [number]) {
        let no = true;
        httpcode.forEach(function (currentValue, index) {
            if (httpcode[index].code == number) {
                no = false;	
                return msg.send("```Code: " + httpcode[index].code + "\nMeaning: " + httpcode[index].phrase + "\nDescription: " + httpcode[index].description + "\n```");
            }
        });
        if (no) return msg.send ("**404 Status Code Not Found**");
    }
};