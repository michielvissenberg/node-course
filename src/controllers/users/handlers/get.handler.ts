import { NextFunction, Request, Response } from "express";

import { UserStore } from "./user.store";

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
    console.log("hello");
    const id: number = parseInt(req.params.id.toString(), 10);
    const user = UserStore.get(id);
    if (!user) {
        res.status(404).send("error: user not found");
        return;
    }
    res.json(user);
    
};

module.exports = { getUserById };