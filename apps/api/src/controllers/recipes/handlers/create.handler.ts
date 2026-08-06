import { RecipeBody } from "../../../contracts/recipe.body";
import { prisma } from "../../../lib/prisma";

export const create = async (body: RecipeBody) => {
    const recipe = await prisma.recipe.create({
        data: {
            name: body.name,
            description: body.description,
        },
    });

    return recipe;
};
