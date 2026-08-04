import { NotFoundException } from "@nestjs/common";
import { UserStore } from "./user.store";

export const deleteUser = (id: string) => {
    const idNum = Number(id)
    const user = UserStore.get(idNum);

    if (!user) {
        throw new NotFoundException("user not found");
    }
    UserStore.delete(idNum); 
};

