const { Argument } = require("klasa");
const { Util } = require("discord.js");

module.exports = class extends Argument {

    run(arg, possible) {
        const result = arg.match(/(\d{1,3}),(\d{1,3}),(\d{1,3})/) || Util.resolveColor(arg.toUpperCase());
        if(!result) throw `${possible.name} must be a valid Hex Code, R,G,B or some normal color name. Examples: \`\`#4286f4\`\` | \`\`66,134,244\`\` | \`\`blue\`\``;
        return ((Array.isArray(result)) ? {
            r: parseInt(result[1]),
            g: parseInt(result[2]),
            b: parseInt(result[3])
        } : {
            r: Math.floor(result / (256*256)),
            g: Math.floor(result / 256) % 256,
            b: result % 256
        });
    }
}; 
