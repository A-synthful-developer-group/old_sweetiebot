const Redis = require("promise-redis")();
const Snappy = require("./Snappy");

module.exports = class Cache {

    constructor() {
        this.redis = Redis.createClient();
    }

    async get(key) {
        const data = await this.redis.get(key);
        if(!data) throw new Error(`The key ${key} doesn't exist!`);
        return JSON.parse(await Snappy.uncompress(Buffer.from(JSON.parse(data).data)));
    }

    async close() {
        return await this.redis.quit();
    }

    async set(key, data, time = 900) {
        this.redis.set(key, JSON.stringify(await Snappy.compress(JSON.stringify(data))), "EX", time);
        return;
    }

    async delete(key) {
        await this.redis.del(key);
        return;
    }

    async has(key) {
        return await this.redis.exists(key) == 1;
    }

    async clean() {   
        await this.redis.flushdb();
        return;
    }

};
