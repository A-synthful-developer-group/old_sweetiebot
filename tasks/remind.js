const { Task } = require("klasa");

module.exports = class extends Task {

    run({ channel, author, content, relative }) {
        const _channel = this.client.channels.get(channel);
        return _channel.send(`Hello <insert <@${author}> here>, you asked me to remind you ${relative} ago about:\`\`\`
${content}
\`\`\`Have a good day, and please die.`,);
    }

};