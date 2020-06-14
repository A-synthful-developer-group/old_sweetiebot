const { Command } = require("klasa");
const sharp = require("sharp");
const Canvas = require("canvas");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            cooldown: 10,
            usage: "<color:color> <color2:color> <alpha:int{0,255}> [image:url]",
            usageDelim: " ",
            description: "Replace certain color to other color.",
            extendedHelp: "If you don't give an image URL it will use the most recent posted image.",
        });
        this.magic = new Map(
            [["ffd8ffe0", "jpeg"], ["ffd8ffdb", "jpeg"], ["ffd8ffe1", "jpeg"], ["89504e47", "png"], ["52494646", "webp"], ["49492a00", "tiff"], ["4d4d002a", "tiff"], ["47494638", "gif"]]
        );
    }

    async run(msg, [color, color2, alpha, url]) {
        const body = await fetch((url) ? url : msg.channel.lastImage).then(res => res.buffer());
        if(!Buffer.isBuffer(body)) return msg.send("This isn't an image!");
        if(!/ffd8ff(e0|db|e1)([0-9a-f]{2}){6}|89504e470d0a1a0a([0-9a-f]{2}){2}|52494646([0-9a-f]{2}){4}5745|49492a00([0-9a-f]{2}){6}|4d4d002a([0-9a-f]{2}){6}|47494638([0-9a-f]{2}){6}/.test(body.toString("hex", 0, 10)))
            return msg.send("This image is not one of the following formats ``JPEG-PNG-GIF-WebP-TIFF``");
        const img = new Canvas.Image;
        img.src = (await sharp(body)
            .png()
            .toBuffer());
        const canvas = new Canvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        const w = img.width, h = img.height;
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        for(let i = 0; i < imageData.data.length; i+=4) {
            if(imageData.data[i]==color.r &&
                imageData.data[i+1]==color.g &&
                imageData.data[i+2]==color.b
            ){
                // change to your new rgb
                imageData.data[i]=color2.r;
                imageData.data[i+1]=color2.g;
                imageData.data[i+2]=color2.b;
                imageData.data[i+3]=alpha;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        const buffer = canvas.toBuffer();
        return msg.channel.sendFile(buffer, `file.${this.magic.get(buffer.toString("hex", 0, 4))}`, `Image color R:${color.r} G:${color.g} B:${color.b} to R:${color2.r} G:${color2.g} B:${color2.b}`);
    }
};