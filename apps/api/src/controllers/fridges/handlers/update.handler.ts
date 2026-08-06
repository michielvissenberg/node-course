import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body) => {
    const fridge = await prisma.fridge.findUnique({
        where: { id },
    });

    if (!fridge) {
        throw new NotFoundException("Fridge not found");
    }
    
    const updateData: any = {};
    if (body.address !== undefined) updateData.name = body.name;
    if (body.floor !== undefined) updateData.floor = body.floor;
    if (body.capacity !== undefined) updateData.capacity = body.capacity;

    return prisma.fridge.update({
        where: { id },
        data: updateData,
    });
};