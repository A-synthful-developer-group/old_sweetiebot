const { Task } = require("klasa");

module.exports = class extends Task {

    async run() {
        this.client.emit("log", "test");
    }

};