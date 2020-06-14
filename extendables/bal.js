const { Extendable, KlasaUser } = require("klasa");


module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { appliesTo: [KlasaUser]});
    }

    get balance() {
        return `${this.configs.get("balanceN").reverse().join("")}.${this.configs.get("balanceD")[0].toString().slice(0, 2)}`;
    }

};