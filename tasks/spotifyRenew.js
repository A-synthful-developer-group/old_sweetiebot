const { Task } = require("klasa");
const snekfetch = require("snekfetch");
const authDetails = require("../auth.json");

module.exports = class extends Task {

    async run() {
        this.client.emit("log", "Asking Spotify for a new Access Token...");
        await snekfetch.post("https://accounts.spotify.com/api/token", {
            data: { 
                grant_type: "refresh_token", refresh_token: authDetails.spotify.refreshToken
            },
            headers: {
                "Authorization": "Basic " + Buffer.from(`${authDetails.spotify.clientID}:${authDetails.spotify.clientSecret}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(r => this.client.cache.set("spotify", r.body.access_token, 3600));
        this.client.emit("log", "Saved new Spotify Access Token on DB!");
    }
};