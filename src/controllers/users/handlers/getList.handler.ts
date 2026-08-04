import { NextFunction, Request, Response } from "express";

import { UserStore } from "./user.store";

export const getList = (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.search as string;
    const users = UserStore.find(query);
    res.json(users);
};

module.exports = { getList };
