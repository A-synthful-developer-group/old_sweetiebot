module.exports = class BigMoment {
    /**
     * It's something like the moment lib but with big int? AND WITHOUT MS
     * @param {BigInt} duration
     */
    constructor(duration) {
        this.duration = duration;
    }
    
    /**
     * @param {BigInt} date 
     */
    static duration(date) {
        return date - BigInt(Math.floor(Date.now()/1000));
    }

    static readableTime(duration) {
        const supermassive = duration/5400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n;
        let remaining = duration%5400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n;
        const lifespanblackholemassofsun = remaining/600000000000000000000000000000000000000000000000000000000000000000000000000000n;
        remaining = remaining%600000000000000000000000000000000000000000000000000000000000000000000000000000n;
        const largestprotonhalflife = remaining/100000000000000000000000000000000000000000000000000000n;
        remaining = remaining%100000000000000000000000000000000000000000000000000000n;
        const smallestprotonhalflife = remaining/260000000000000000000000000000000000000000n;
        remaining = remaining%260000000000000000000000000000000000000000n;
        const yottaseconds = remaining/1000000000000000000000000n;
        remaining = remaining%1000000000000000000000000n;
        const zettaseconds = remaining/1000000000000000000000n;
        remaining = remaining%1000000000000000000000n;
        const exaseconds = remaining/1000000000000000000n;
        remaining = remaining%1000000000000000000n;
        const eons = remaining/31556926000000000n;
        remaining = remaining%31556926000000000n;
        const milleniums = remaining/BigInt(3.1556926e+10);
        remaining = remaining%BigInt(3.1556926e+10);
        const years = remaining/31556926n;
        remaining = remaining%31556926n;
        const months = remaining/2629743n;
        remaining = remaining%2629743n;
        const days = remaining/86400n;
        remaining = remaining%86400n;
        const hours = remaining/3600n;
        remaining = remaining%3600n;
        const minutes = remaining/60n;
        const seconds = remaining%60n;
        remaining = [];
        if(supermassive > 1) {
            remaining.push("approx. lifespan of " + supermassive + " suppermasssive black holes with each one having a mass of 20 trillion solar masses");
        } else if(supermassive == 1) {
            remaining.push("approx. lifespan of a suppermasssive black hole with a mass of 20 trillion solar masses");
        }
        if(lifespanblackholemassofsun > 1) {
            remaining.push("approx. lifespan of " + lifespanblackholemassofsun + " black holes with each one having the mass of the sun");
        } else if(lifespanblackholemassofsun == 1) {
            remaining.push("approx. lifespan of a black hole with the mass of the sun");
        }
        if(largestprotonhalflife > 1) {
            remaining.push("the largest possible half-life of " + largestprotonhalflife + " protons");
        } else if(largestprotonhalflife == 1) {
            remaining.push("the largest possible half-life of a proton");
        }
        if(smallestprotonhalflife > 1) {
            remaining.push("the smallest possible half-life of " + smallestprotonhalflife + " protons");
        } else if(smallestprotonhalflife == 1) {
            remaining.push("the smallest possible half-life of a proton");
        }
        if(yottaseconds > 1) {
            remaining.push(yottaseconds + " yottaseconds");
        } else if(yottaseconds == 1) {
            remaining.push("1 yottasecond");
        }
        if(zettaseconds > 1) {
            remaining.push(zettaseconds + " zettaseconds");
        } else if(zettaseconds == 1) {
            remaining.push("1 zettasecond");
        }
        if(exaseconds > 1) {
            remaining.push(exaseconds + " exaseconds");
        } else if(exaseconds == 1) {
            remaining.push("1 exasecond");
        }
        if(eons >= 1) {
            remaining.push(eons + "AE");
        }
        if(milleniums > 1) {
            remaining.push(milleniums + " milleniums");
        } else if(milleniums == 1) {
            remaining.push("1 millenium");
        }
        if(years > 1) {
            remaining.push(years + " years");
        } else if(years == 1) {
            remaining.push("1 year");
        }
        if(months > 1) {
            remaining.push(months + " months");
        } else if(months == 1) {
            remaining.push("1 month");
        }
        if(days > 1) {
            remaining.push(days + " days");
        } else if(days == 1) {
            remaining.push("1 day");
        }
        if(hours > 1) {
            remaining.push(hours + " hours");
        } else if(hours == 1) {
            remaining.push("1 hour");
        }
        if(minutes > 1) {
            remaining.push(minutes + " minutes");
        } else if(minutes == 1) {
            remaining.push("1 minute");
        }
        if(seconds > 1) {
            remaining.push(seconds + " seconds");
        } else if(seconds == 1) {
            remaining.push("1 second");
        }
        return remaining.join(", ");
    }
};