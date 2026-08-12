import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { RecipeBody } from "../../../contracts/recipe.body";
import { recipeData } from "../../../contracts/data.schemas";
import { toUpdateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import { assertOwnerExists } from "../../../lib/rules";

export const update = async (
    id: string,
    body: Partial<RecipeBody>,
    userId: string
) => {
    const recipe = await prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
        throw new NotFoundException("Recipe not found");
    }

    if (recipe.ownerId != null && recipe.ownerId !== userId) {
        throw new ForbiddenException("cannot change another user's recipes");
    }

    const data = toUpdateData(recipeData, body);

    // assign owner to this recipe (user changes recipe)
    if (data.ownerId != null) {
        await assertOwnerExists(data.ownerId);
    }

    return prisma.recipe.update({ where: { id }, data });
};
