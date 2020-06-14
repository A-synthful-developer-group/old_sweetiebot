const { Command } = require("klasa");
const snekfetch = require("snekfetch");

module.exports = class StopCommand extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 6,
            aliases: ["dex"],
            usage: "<pokemon|abilty|moves|items> (thing:str) [...]",
            usageDelim: " ",
            description: "Searches the given Pokémon in the Dex",
            extendedHelp: "No extended help available.",
            enabled: false
        });
    }

    async pokemon(msg, [...thing]){
        const arg = thing.join("-");
        const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon/${arg}`);
        return msg.send(body);
    }
    async ability(msg, [...thing]){
        const arg = thing.join("-");
        const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon/ability/${arg}`);
        return msg.send(body);
    }
    async move(msg, [...thing]){
        const arg = thing.join("-");
        const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon/move/${arg}`);
        return msg.send(body);
    }
    async item(msg, [...thing]){
        const arg = thing.join("-");
        const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon/item/${arg}`);
        return msg.send(body);
    }
};