import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body, userId) => {
    if (id !== null) { 
        if (userId !== id) {
            throw new ForbiddenException("cannot change another user's recipes");
        }
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!recipe) {
        throw new NotFoundException("Recipe not found");
    }
    
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    // assign owner to this recipe (user changes recipe)
    if (body.ownerId != null) {
        if (await prisma.product.findUnique({ where: { id: body.ownerId }}) !== null) {
            updateData.ownerId = body.ownerId;
        } else {
            throw new NotFoundException("Owner not found");
        }
    }
    
    return prisma.recipe.update({
        where: { id },
        data: updateData,
    });
};