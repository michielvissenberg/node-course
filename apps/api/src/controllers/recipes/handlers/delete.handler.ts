import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteRecipe = async (id: string, userId) => {
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!existingRecipe) {
        throw new NotFoundException("Recipe not found");
    }

    if (existingRecipe.ownerId != null) {
        if (existingRecipe.ownerId !== userId) {
            throw new ForbiddenException("cannot delete a recipe for another user");
        }
    }

    await prisma.recipe.delete({
        where: { id },
    });
};