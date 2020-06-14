const { Command } = require("klasa");
const sharp = require("sharp");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            aliases: ["greyscale"],
            usage: "[image:url]",
            description: "Convert image to 8-bit greyscale.",
            extendedHelp: "If you don't give an image URL it will use the most recent posted image.",
        });
        this.magic = new Map(
            [["ffd8ffe0", "jpeg"], ["ffd8ffdb", "jpeg"], ["ffd8ffe1", "jpeg"], ["89504e47", "png"], ["52494646", "webp"], ["49492a00", "tiff"], ["4d4d002a", "tiff"], ["47494638", "gif"]]
        );
    }

    async run(msg, [url]) {
        const body = await fetch((url) ? url : msg.channel.lastImage).then(res => res.buffer());
        if(!Buffer.isBuffer(body)) return msg.send("This isn't an image!");
        if(!/ffd8ff(e0|db|e1)([0-9a-f]{2}){6}|89504e470d0a1a0a([0-9a-f]{2}){2}|52494646([0-9a-f]{2}){4}5745|49492a00([0-9a-f]{2}){6}|4d4d002a([0-9a-f]{2}){6}|47494638([0-9a-f]{2}){6}/.test(body.toString("hex", 0, 10)))
            return msg.send("This image is not one of the following formats ``JPEG-PNG-GIF-WebP-TIFF``");
        const image = await sharp(body)
            .png({
                quality: 100,
                chromaSubsampling: "4:4:4",
            })
            .gamma()
            .greyscale()
            .toBuffer();
        return msg.channel.sendFile(image, `file.${this.magic.get(image.toString("hex", 0, 4))}`, "Image has been converted to 8-bit greyscale");
    }
};