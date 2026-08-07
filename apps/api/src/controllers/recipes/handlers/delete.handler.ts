import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteRecipe = async (id: string, userId) => {
    if (id != null) {
        if (id !== userId) {
            throw new ForbiddenException("cannot delete a recipe for another user");
        }
    }
    
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!existingRecipe) {
        throw new NotFoundException("Recipe not found");
    }

    await prisma.recipe.delete({
        where: { id },
    });
};