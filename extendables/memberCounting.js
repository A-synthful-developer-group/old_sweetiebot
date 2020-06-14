const { Extendable, KlasaGuild } = require("klasa");


module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { 
            appliesTo: [KlasaGuild], 
            klasa: true 
        });
    }

    get lastMemberCount() {
        return this.client.gateways.guilds.get(this.id).get("lastMemberCount");
    }

};