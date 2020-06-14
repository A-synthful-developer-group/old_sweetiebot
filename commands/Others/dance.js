const { Command, util } = require("klasa");

module.exports = class DanceCommand extends Command {
    constructor(...args) {
        super(...args, {
            description: "Lets dance!",
            extendedHelp: "No extended help available."
        });
        this.danceList = [
            ["(>'-')>", "<('-'<)", "^('-')^", "v('-')v", "(>'-')>", "(^-^)"],
            ["ヽ('-'ヽ)", "(∕'-')∕", "ヽ('-'ヽ)", "('-')"],
            ["¯\\_(ツ)_/¯", "_/¯(ツ)¯\\_", "¯\\_(ツ)¯\\_", "_/¯(ツ)_/¯", "(ツ)"],
            ["┗(＾0＾)┓", "┎(＾0＾)┛", "┗(＾0＾)┛", "┎(＾0＾)┓", "(＾0＾)"],
            ["(◞ﾟ▽ﾟ)◞" ,"◟(ﾟ▽ﾟ◟)", "◟(ﾟ▽ﾟ)◞", "(ﾟ▽ﾟ)"]
        ];
    }

    async run(msg) {
        const random = Math.floor(Math.random() * this.danceList.length);
        const sent = await msg.send(this.danceList[random][0]);
        await util.sleep(1000);
        for(var i = 1; i < this.danceList[random].length; i++) {
            await sent.edit(this.danceList[random][i]);
            await util.sleep(1000);
        }
    }
};