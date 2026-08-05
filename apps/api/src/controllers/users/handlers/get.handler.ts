import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const get = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    }) 
    
    if (!user) {
        throw new NotFoundException("user not found");
    }
    
    return user;    
};
