import { NextFunction, Request, Response } from "express";

import { UserStore } from "./user.store";

export const deleteById = (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id.toString(), 10);
    const user = UserStore.get(id);

    if (!user) {
        return res.status(400).json( {error: "user not found"});
    }

    UserStore.delete(id);
    res.status(204).json(`user ${id} deleted`);
};

module.exports = { deleteById };