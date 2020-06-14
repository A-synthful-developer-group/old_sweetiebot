const EventEmitter = require("events");
const tls = require("tls");

const options = {
    host: "api.vndb.org",
    port: 19535,
};

module.exports = class VNDB extends EventEmitter {
    constructor({ clientName }, cb) {
        super();

        /**
         * The connection used for DB
         * @type {TLSSocket}
         */
        this.connection = tls.connect(options, cb);
        this.connection.setEncoding("utf8");
        this.connection.setKeepAlive(true);

        this.client = clientName;
        this.logged = false;
    }
    
    login({user, password} = {}) {
        return new Promise((res, rej) => {
            const log = {
                protocol: 1,
                client: this.client,
                clientver: 0.01,
            };
            if(user && password) log.user = user, log.password = password;
            this.connection.write(`login ${JSON.stringify(log)}\x04`);
            this.connection.once("data", str => {
                if(str.includes("ok\x04")) {
                    this.logged = true;
                    this.emit("login");
                    res();
                } else {
                    rej(str);
                }
            });
        });
    }

    dbstats() {
        return new Promise((res, rej) => {
            this.connection.write("dbstats\x04");
            this.connection.once("data", str => {
                if(str.includes("dbstats")) {
                    const data = JSON.parse(str.replace("dbstats", "").replace("\x04", ""));
                    this.emit("dbstats", data);
                    res(data);
                } else {
                    rej(str);
                }
            });
        });
    }

    get(type, flags, filter, options) {
        return new Promise((res, rej) => {
            this.connection.write(`get ${type} ${flags.join(",")} ${filter}${options ? ` ${JSON.stringify(options)}` : ""}\x04`);
            this.connection.once("data", str => {
                if(str.includes("results")) {
                    const data = JSON.parse(str.replace("results", "").replace("\x04", ""));
                    this.emit("get", data, type, flags, filter, options);
                    res(data);
                } else {
                    rej(str);
                }
            });
        });
    }

    end() {
        this.connection.end();
    }
};