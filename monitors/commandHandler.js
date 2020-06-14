/* 
Mostly made by dirigeants (https://github.com/dirigeants) in the klasa repo (https://github.com/dirigeants/klasa/blob/master/src/monitors/commandHandler.js)
It has the same license (MIT Klasa 2017-2019) so meh wont do that much legalities
*/

const CommandHandler = require(require.resolve("klasa").replace("/index.js", "/monitors/commandHandler"));

module.exports = class extends CommandHandler {

    constructor(...args) {
        super(...args);
    }

};
