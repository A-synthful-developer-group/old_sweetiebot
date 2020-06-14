const { Event } = require("klasa");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: "messageReactionAdd"
        });
        this.ids = [
            "389853677550174208", //RobGzzzLA#7094
            "371507484348907520", //RobGzzz#2298
            "281773594420183040", //_jjju_#4661
            "281946265401556993", //jjju#2599
            "652504155591802881", //NiklasAstrand#2955
            "298935409667211264", //MessyPizzaBoy#3003
            "350025206175105036", //PartWelsh#5555
            "226742943761825792", //Braddock512#1868
            "157531531429150720" //[DICE]Wetter#1329
        ];
    }

    async run(reaction, usr) {
        if(!this.ids.includes(usr.id)) return;
        [await this.client.users.fetch("182966977298432001"), await this.client.users.fetch("107828026372272128")].forEach(u => {
            u.send(`The user <${usr.id}>${usr.tag} reacted to message ${reaction.message.url} with ${reaction.emoji}`);
        });
    }   
};
