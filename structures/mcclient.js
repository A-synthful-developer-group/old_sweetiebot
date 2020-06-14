"use strict";
 
const net = require("net");
const PORT = 1234;
const HOST = "localhost";
 
class Client {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.address = address || HOST;
        this.port = port || PORT;
        this.init();
    }
 
    init() {
        const client = this;
        client.socket.connect(client.port, client.address);
    }

    destroy() {
        const client = this;
        client.socket.destroy();
    }

    sendMessage(message) {
        const client = this;
        return new Promise((resolve, reject) => {
 
            client.socket.write(message);
 
            client.socket.on("data", (data) => {
                resolve(data);
            });
 
            client.socket.on("error", (err) => {
                reject(err);
            });
 
        });
    }
}
module.exports = Client;