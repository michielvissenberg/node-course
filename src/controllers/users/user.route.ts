import { NextFunction, Router, Request, Response } from "express";
import { create } from "./handlers/create.handler";
import { getUserById } from "./handlers/get.handler";
import { getList } from "./handlers/getList.handler";
import { updateById } from "./handlers/update.handler";
import { deleteById } from "./handlers/delete.handler";

// const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     if (req.header("auth") !== "api-key") {
//         return res.status(401).send("Unauthorized");
// 	}
// 	next();
// };

export class UserRoute {
    public router: Router;
    public path: string;

    constructor() {
        this.router = Router();
        this.path = "users";

        this.router.get("/", getList);
        this.router.get("/:id", getUserById);
        this.router.patch("/:id", updateById);
        this.router.delete("/:id", deleteById);
        this.router.post("/", create);
    } 
}

module.exports = { UserRoute };
