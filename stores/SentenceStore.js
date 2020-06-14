const { AliasStore } = require("klasa");
const Sentence = require("../pieces/Sentence");

module.exports = class SentenceStore extends AliasStore {

    constructor(client) {
        super(client, "sentences", Sentence);
    }

};