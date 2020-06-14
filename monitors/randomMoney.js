const { Monitor } = require("klasa");


module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: "randomMoney",
            enabled: false,
            ignoreOthers: false
        });
    }

    run(msg) {
        msg.send("u gay");
        return null;
    }
};
