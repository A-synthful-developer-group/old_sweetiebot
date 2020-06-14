const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: "alert",
            usage: "<str:str>"
        });
    }

    async run(msg, [str]) {
        const words = str.split(" "), filtered = [], parsed = [];
        let string = false, stringType = "", sentenceType;
        for(const word of words) {
            if(string) {
                if(word.endsWith(stringType))
                    filtered[filtered.length - 1].data += word.substring(0, word.length - 1), string = false;
                else
                    filtered[filtered.length - 1].data += word;
            } else {
                if(word.startsWith("\"")) {
                    if(word.endsWith("\""))
                        filtered.push({type: "string", data: word.substring(1, word.length - 1)});
                    else
                        string = true, stringType = "\"", filtered.push({type: "string", data: word.substr(1)});
                } else if(word.startsWith("'")) {
                    if(word.endsWith("'"))
                        filtered.push({type: "string", data: word.substring(1, word.length - 1)});
                    else
                        string = true, stringType = "'", filtered.push({type: "string", data: word.substr(1)});
                } else {
                    if(this.client.sentences.has(word))
                        sentenceType = this.client.sentences.get(word);
                    else
                        filtered.push(word);
                }
            }
        }
        if(string) return msg.send("String never ended");
        if(!sentenceType) return msg.send("Couldn't determine the type of alert");
        Array.prototype.push.apply(parsed, describe(filtered));
        Array.prototype.push.apply(parsed, sentenceType.describe(filtered));
        const noun = parsed.find((value) => value.type === "noun");
        if(!noun) return msg.send(`No noun was found with the type \`\`${sentenceType.name}\`\``);
        const verb = parsed.find((value) => value.type === "verb");
        if(!verb) return msg.send(`No verb was found with the type \`\`${sentenceType.name}\`\``);
        msg.send(`${parsed[0].data},${parsed[1].data},${parsed[2].data}`);
    }
};

function describe(words) {
    let foundTrigger, index;
    for(let i = 0; i < words.length; i++) {
        const word = words[i];
        if(typeof word == "object") {
            if(foundTrigger) {
                words.splice(index, i-index);
                return { type: foundTrigger, data: word.data };
            }
        } else if(foundTrigger && word == "when") {
            return { type: foundTrigger, data: "(DEFAULT MSG)[its pretty hard to make this possible]" };
        } else {
            if(/tell|send|say/i.test(word)) {
                foundTrigger = "say";
                index = i;
            } else if(/dm/i.test(word)) {
                foundTrigger = "dm";
                index = i;
            } 
        }
    }
}