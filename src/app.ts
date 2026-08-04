import { NextFunction, Request, Response } from "express";

import express from "express";
import { UserRoute as AppUserRoute } from "./controllers/users/user.route";

export class App {
    public host: any;

    constructor() {
        this.host = express();
        this.host.use(express.json());
        this.host.use((req: Request, res: Response, next: NextFunction) => {
	        console.log(req.method, req.url);
	        next();
        });
        const usersRoute = new AppUserRoute();
        this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
            this.host.use((req: Request, res: Response, next: NextFunction) => {
	        res.status(404).send("No Endpoint found");
        });
        this.host.use((error: any, req: Request, res: Response, next: NextFunction) => {
	        res.status(400).json(error);
        });
    }

    listen () {
        this.host.listen(3000, () => {
            console.info(`app running on http://localhost:3000`);
            console.info(`------------------------------------`);
        });
        this.host.get("/", (req: Request, res: Response, next: NextFunction) => {
	        res.send("Hello World!");
        });
    }
}

module.exports = { App };