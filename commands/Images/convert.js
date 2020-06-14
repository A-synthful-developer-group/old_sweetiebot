const { Command } = require("klasa");
const sharp = require("sharp");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            usage: "<png|jpeg|webp|tiff|raw> [link:url]",
            usageDelim: " ",
            description: "Converts an image to the requested type.",
            extendedHelp: "If you don't give an image URL it will use the most recent posted image.",
        });
        this.magic = new Map(
            [["ffd8ffe0", "jpeg"], ["ffd8ffdb", "jpeg"], ["ffd8ffe1", "jpeg"], ["89504e47", "png"], ["52494646", "webp"], ["49492a00", "tiff"], ["4d4d002a", "tiff"], ["47494638", "gif"]]
        );
    }

    async run(msg, [option, url]) {
        const body = await fetch((url) ? url : msg.channel.lastImage).then(res => res.buffer());
        if(!Buffer.isBuffer(body)) return msg.send("This isn't an image!");
        if(!/ffd8ff(e0|db|e1)([0-9a-f]{2}){6}|89504e470d0a1a0a([0-9a-f]{2}){2}|52494646([0-9a-f]{2}){4}5745|49492a00([0-9a-f]{2}){6}|4d4d002a([0-9a-f]{2}){6}|47494638([0-9a-f]{2}){6}/.test(body.toString("hex", 0, 10)))
            return msg.send("This image is not one of the following formats ``JPEG-PNG-GIF-WebP-TIFF``");
        if(option === this.magic.get(body.toString("hex", 0, 4)))
            return msg.send(`Why are you trying to convert a ${option.toUpperCase()} to ${option.toUpperCase()}`);
        const image = await sharp(body)
            .toFormat(option, {
                quality: 100,
                chromaSubsampling: "4:4:4",
            })
            .toBuffer();
        if(option == "raw") {
            const ui8 = new Uint8Array(image.buffer, image.byteOffset, image.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return msg.channel.sendFile(Buffer.from(ui8.toString()), "output.txt", "Raw conversion is returned as an stringified Uint8Array, you can read more about Uint8Array here: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array>");
        }
        return msg.channel.sendFile(image, `file.${option}`, "Image has been converted to " + option);
    }
};
