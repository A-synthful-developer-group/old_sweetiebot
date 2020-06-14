const { Store } = require("klasa");
const MusicalBox = require("../pieces/MusicalBox");

module.exports = class MusicalBoxStore extends Store {

    constructor(client) {
        super(client, "musicalbox", MusicalBox);
    }

    async verify(arg) {
        try {
            new URL(arg);
        } catch(e) {
            return;
        }
        for(const [,value] of this) {
            if(value.verify instanceof RegExp) {
                if(value.verify.test(arg)) return value;
            } else {
                if(await value.verify(arg)) return value;
            }
        }
        return;
    }

    init() {
        const { Collection } = require("discord.js");
        this.client.music = new Collection();
        this.client.emit("log", "The music queue has been made");
        return Promise.all(this.map(piece => piece.enabled ? piece.init() : piece.unload()));
    }

};