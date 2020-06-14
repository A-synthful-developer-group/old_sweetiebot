const Sentence = require("../pieces/Sentence");

class Song extends Sentence {
    constructor(...args) {
        super(...args, {
            aliases: ["track"]
        });
    }

    describe(words) {
        const array = [];
        for(const word of words) {
            if(typeof word == "object") {
                array.push(word);
            } else {
                if(/this|next|\d+?/mi.test(word) && !array.find(r => r.type == "noun")) { 
                    array.push({ type: "noun", data: word });
                } else if(/ends/mi.test(word) && !array.find(r => r.type == "verb")) { 
                    array.push({ type: "verb", data: word });
                }  
            }
        }
        return array;
    }

}

Song.builder = class SongBuilder extends Sentence.Builder {
    constructor(options = {}) {
        super(options);
    }

    from(msg, [which]) {
        const musicQueue = this.client.music.get(msg.guild.id);
        if(!musicQueue) throw new Error("There is no music queue");
        if(which == "this") {
            this.object = musicQueue.songs[0];
        } else if(which == "next") {
            this.object = musicQueue.songs[1];
        } else if(!isNaN(which)) {
            const whichInt = parseInt(which);
            if(whichInt > musicQueue.songs.length || whichInt < 0) throw new Error("Invalid number for song");
            this.object = musicQueue.songs[whichInt];
        } else {
            throw new Error("Song identifier not found");
        }
        this.musicQueue = musicQueue;
        return this;
    }

    contains(msg, [what]) {
        const musicQueue = this.client.music.get(msg.guild.id);
        if(!musicQueue) throw new Error("There is no music queue");
        if(what == "ends") {
            if(this.object !== musicQueue.songs[0])
                throw new Error("The song already ended");
            this.event = "songEnded";
        } else {
            throw new Error("Verb not found");
        }
        return this;
    }

    build() {
        return new Sentence.Action({
            filter: this.musicQueue,
            event: this.event,
            res: this.res
        });
    }
};

module.exports = Song;