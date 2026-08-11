import { prisma } from "../../../lib/prisma"
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { z } from 'zod';

export const getAiRecipe = async (userId: string) => {
    const products = await prisma.product.findMany({
        where: {ownerId: userId},
    });
    const productList: string[] = [];
    if (products) {
        products.map((product) => {
            productList.push(product.name);
          });
    };

    const {output: recipe} = await generateText({
        model: anthropic('claude-haiku-4-5-20251001'),
        output: Output.object({
            schema: z.object({
                name: z.string(),
                ingredients: z.array(z.object({name: z.string(), toBeBought: z.boolean()})),
                description: z.string(),
                steps: z.array(z.string()),
            })
        }),
        system: 
            `Your task is to write a recipe for the person prompting, all available 
            ingredients will be sent, which does not mean you need to use all of them.
            If the list is not good enough to make a full meal, you have to add some ingredients 
            of your own choice.
            Always remember: keep it realistic, no random stuff thrown on a plate, i want nice meals, 
            even if that means i have to buy more than half of the products of the generated recipe, 
            you can also assume that pepper, salt, spices, olive oil and butter is available, 
            DO NOT MENTION THESE, they are trivial. Use many emojis.
            ALWAYS double check your ingredients and if you need to buy them or if they are provided.
            When no ingredients are provided you can come up with a recipe yourself`,
        prompt: `these are all products currently in my possession: ${productList}`,
    });

    return recipe;
}