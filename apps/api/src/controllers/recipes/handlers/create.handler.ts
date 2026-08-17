import { ForbiddenException } from "@nestjs/common";
import { RecipeBody } from "../../../contracts/recipe.body";
import { recipeData } from "../../../contracts/data.schemas";
import { toCreateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import { assertOwnerExists } from "../../../lib/rules";

export const create = async (body: RecipeBody, userId: string) => {
    if (body.ownerId != null && userId !== body.ownerId) {
        throw new ForbiddenException("cannot create a recipe for another user");
    }

    const data = toCreateData(recipeData, body);

    // assign owner to this recipe (user writes down recipe)
    if (data.ownerId != null) {
        await assertOwnerExists(data.ownerId);
    }

    return prisma.recipe.create({ data });
};
