const { Task } = require("klasa");

module.exports = class extends Task {

    run({ id }) {
        const schedule = this.client.schedule.get(id);
        if(!schedule) return;
        return schedule.delete()
            .then(() => this.client.emit("log", `Successfully deleted the task ${id}`))
            .catch(e => this.client.emit("error" , e));
    }

};