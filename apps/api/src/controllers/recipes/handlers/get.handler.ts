import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const get = async (id: string) => {
    const recipe = await prisma.recipe.findUnique({
        where: { id },
    }) 
    
    if (!recipe) {
        throw new NotFoundException("recipe not found");
    }
    
    return recipe;    
};
