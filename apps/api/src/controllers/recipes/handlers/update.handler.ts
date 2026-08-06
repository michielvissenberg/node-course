import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body) => {
    const recipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!recipe) {
        throw new NotFoundException("Recipe not found");
    }
    
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    
    return prisma.recipe.update({
        where: { id },
        data: updateData,
    });
};