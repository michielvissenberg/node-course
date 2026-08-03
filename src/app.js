const express = require("express");
const { UserRoute } = require("./controllers/users/user.route");

class App {
    constructor() {
        this.host = express();
        const usersRoute = new UserRoute();
        this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
    }

    listen () {
        this.host.listen(3000, () => {
            console.info(`app running on http://localhost:3000`);
            console.info(`------------------------------------`);
        });
        this.host.get("/", (req, res, next) => {
	        res.send("Hello World!");
        });
    }
}

module.exports = { App };