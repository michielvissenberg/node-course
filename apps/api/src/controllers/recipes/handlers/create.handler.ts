import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { RecipeBody } from "../../../contracts/recipe.body";
import { prisma } from "../../../lib/prisma";

export const create = async (body: RecipeBody, userId) => {
    if (body.ownerId != null) {
        if (userId !== body.ownerId) {
            throw new ForbiddenException("cannot create a recipe for another user");
        }
    }

    const data: any = {};
    if (body.name != undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    // assign owner to this recipe (user writes down recipe)
    if (body.ownerId != null) {
        if (await prisma.user.findUnique({ where: { id: body.ownerId }}) !== null) {
            data.ownerId = body.ownerId;
        } else {
            throw new NotFoundException("Owner not found");
        }
    }

    const recipe = await prisma.recipe.create({
        data: data,
    });

    return recipe;
};
