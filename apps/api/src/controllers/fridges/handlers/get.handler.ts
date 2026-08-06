import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const get = async (id: string) => {
    const fridge = await prisma.fridge.findUnique({
        where: { id },
    }) 
    
    if (!fridge) {
        throw new NotFoundException("fridge not found");
    }
    
    return fridge;    
};
