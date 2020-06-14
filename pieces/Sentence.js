const { AliasPiece } = require("klasa");

class Sentence extends AliasPiece {

    constructor(client, store, file, core, options = {}) {
        super(client, store, file, core, options);

        this.name = this.name.toLowerCase();
    }

    describe() {
        // Defined in extension Classes
        throw new Error(`The describe method has not been implemented by ${this.type}:${this.name}.`);
    }

}

Sentence.Action = class Action {
    constructor(options = {}) {
        this.event = options.event;
        this.filter = options.filter;
        this.res = options.res;
    }
};

Sentence.Builder = class ActionBuilder {
    constructor(options = {}) {
        this.sentence = options.sentence;
        this.client = options.client;
    }

    from() {
        // Defined in extension Classes
        throw new Error(`The from method has not been implemented by ${this.sentence.type}:${this.sentence.name}.`);
    }

    contains() {
        // Defined in extension Classes
        throw new Error(`The contains method has not been implemented by ${this.sentence.type}:${this.sentence.name}.`);
    }

    send(msg, [type, res]) {
        if(type == "dm") {
            this.res = () => msg.author.send(res);
        } else if(type == "say") {
            this.res = () => msg.channel.send(res);
        }
        return this;
    }

    build() {
        // Defined in extension Classes
        throw new Error(`The build method has not been implemented by ${this.sentence.type}:${this.sentence.name}.`);
    }
};

module.exports = Sentence;