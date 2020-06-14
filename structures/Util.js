const moment = require("moment");
const { util } = require("klasa");
const { promisify } = require("util");
const { parseString } = require("xml2js");
let sensitivePatterns;

class Util {
    constructor() {
        throw new Error("This class may not be initiated with new");
    }

    static readableTime(milliseconds) {
        if(isNaN(milliseconds)) return false;
        const ment = moment.duration(milliseconds);
        let seconds = ment.seconds();
        let minutes = ment.minutes();
        let hours = ment.hours();
        let days = ment.days();
        let months = ment.months();
        let years = ment.years();
        return `${(years > 0 ? `${years}y` : "")}${(months > 0 ? `${months}mo` : "")}${(days > 0 ? `${days}d ` : "")}${(hours > 0 ? `${(hours > 9 ? `${hours}:` : `0${hours}:`)}` : "")}${(minutes > 0 ? `${(minutes > 9 ? `${minutes}:` : `0${minutes}:`)}` : "00:")}${(seconds > 0 ? `${(seconds > 9 ? `${seconds}` : `0${seconds}`)}` : "00")}`;
    }

    static moreTime(milliseconds) {
        if(isNaN(milliseconds)) return false;
        const ment = moment.duration(milliseconds);
        let minutes = ment.minutes();
        let hours = ment.hours();
        let days = ment.days();
        let months = ment.months();
        let years = ment.years();
        return `${(years > 0 ? `${years} year(s) ` : "")}${(months > 0 ? `${months} month(s) ` : "")}${(days > 0 ? `${days} day(s) ` : "")}${(hours > 0 ? `${hours} hour(s) ` : "")}${(minutes > 0 ? `${minutes} minute(s) ` : "")}`.trimRight();
    }

    static clean(text) {
        return text.replace(sensitivePatterns, "「ｒｅｄａｃｔｅｄ」");
    }

    static changePatterns([...patterns]) {
        for(let i = 0; i < patterns.length; i++) {
            while(patterns[i] == "")
                patterns.splice(i, 1);
            patterns[i] = util.regExpEsc(patterns[i]);
        }
        sensitivePatterns = new RegExp(`(${patterns.join(")|(")})`, "gi");
    }

    static unescapeHTML(html) {
        const map = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": "\"",
            "&#39;": "'"
        };
          
        return html.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g, m => map[m] );
    }
}

Util.parseString = promisify(parseString);

module.exports = Util;