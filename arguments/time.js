const { Argument } = require("klasa");

module.exports = class extends Argument {

    run(arg, possible, message) {
        arg = arg.replace(/\s+/g, "");
        let SECONDS = /(\d+) *(?:seconds|seconds|sec|s)/i;
        let MINUTES = /(\d+) *(?:minutes|minute|min|m)/i;
        let HOURS = /(\d+) *(?:hours|hour|h)/i;
        let DAYS = /(\d+) *(?:days|days|d)/i;

        let delta = 0;

        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let days = 0;
        let years = 0;

        let s = SECONDS.exec(arg);
        if (s && s[1]) {
            delta += +s[1];
            seconds += +s[1];
        }

        s = MINUTES.exec(arg);
        if (s && s[1]) {
            delta += (+s[1] * 60);
            minutes += +s[1];
        }

        s = HOURS.exec(arg);
        if (s && s[1]) {
            delta += (+s[1] * 60 * 60);
            hours += +s[1];
        }

        s = DAYS.exec(arg);
        if (s && s[1]) {
            delta += (+s[1] * 60 * 60 * 24);
            days += +s[1];
        }
        if (isNaN((hours + minutes + seconds)) || delta < 1) throw message.language.get("RESOLVER_INVALID_TIME", possible.name);
        return {
            absolute: new Date().getTime() + (delta * 1000),
            relative: (delta * 1000),
            seconds: seconds,
            minutes: minutes,
            hours: hours,
            days: days,
            years: years
        };
    }
}; //Code made by Zephy - https://github.com/Zephyrrus