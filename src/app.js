const express = require("express");
const { UserRoute } = require("./controllers/users/user.route");

class App {
    constructor() {
        this.host = express();
        this.host.use(express.json());
        this.host.use((req, res, next) => {
	        console.log(req.method, req.url);
	        next();
        });
        const usersRoute = new UserRoute();
        this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
            this.host.use((req, res, next) => {
	        res.status(404).send("No Endpoint found");
        });
        this.host.use((error, req, res, next) => {
	        res.status(400).json(error);
        });
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