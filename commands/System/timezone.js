const { Command } = require("klasa");
const fetch = require("node-fetch");
const authDetails = require("../../auth.json");

module.exports = class TimeCommand extends Command {
    constructor(...args) {
        super(...args, {
            usage: "<str:str> [...]",
            usageDelim: " ",
            cooldown: 5,
            description: "Gives you timezone difference time.",
            extendedHelp: "Get: Must give a timezone (Europe/Budapest) or a Position (51.507351:-0.127758) (First is Latitude and the other is Longitude)\nCompare: Must give two different timezones (Europe/Budapest Asia/Brunei) or two different positions (51.507351:-0.127758 41.878114:-87.629798)"
        });   
    }

    async run(msg, [str]) {
        let url = `https://api.timezonedb.com/v2/get-time-zone?key=${authDetails.timezonedb}&format=json`;
        if(/[a-zA-Z]+\/[a-zA-Z]+/.test(str)) {
            url += `&by=zone&zone=${str}`;
        } else if(/-?\d+\.?\d+?:-?\d+\.?\d+?/.test(str)) {
            const res = /(-?\d+\.?\d+?):(-?\d+\.?\d+ ?)/.exec(str);
            url += `&by=position&lat=${res[1]}&lng=${res[2]}`;
        } else {
            return msg.send("Sorry but your argument was incorrect, why not check the extended help of the command?");
        }
        const sent = await msg.send("Searching for some time info...");
        const body = await fetch(url).then(r => r.json());
        if(body.status != "OK") return sent.edit("Seems the argument you sent me was wrong");
        return sent.edit(`Current time in ${body.zoneName} is ${body.formatted} and the abbrevation of such time is ${body.abbreviation} with an offset of ${(Math.sign(body.gmtOffset) === -1) ? body.gmtOffset/3600 : ((Math.sign(body.gmtOffset) === 1) ? `+${body.gmtOffset/3600}` : "0")}`);
    }
};