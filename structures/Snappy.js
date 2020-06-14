const { promisify } = require("util");
const snappy = require("snappy");

class Snappy {

    constructor() {
        throw new Error("This class may not be initiated with new");
    }

}

Snappy.compress = promisify(snappy.compress);

Snappy.uncompress = promisify(snappy.uncompress);

Snappy.isValidCompressed = promisify(snappy.isValidCompressed);

module.exports = Snappy;
