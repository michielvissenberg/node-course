import { NotFoundException } from "@nestjs/common";
import { UserStore } from "./user.store";

export const get = (id: string) => {
    const idNum = Number(id);
    const user = UserStore.get(idNum);
    if (!user) {
        throw new NotFoundException("user not found");
    }
    return user;    
};
