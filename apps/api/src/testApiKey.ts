import { anthropic } from '@ai-sdk/anthropic';

import { generateText } from 'ai';


async function main() {
    const ingredients: string[] = ["tomato", "steak", "salad", "cheese", "milk", "salt", "pepper", "cookie"] 
    const { text } = await generateText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system: 
            `Your task is to write a recipe for the person prompting, all ingredients will 
            be sent, you do not need to use all of them, but use as many as possible.
            If the list is not good enough to make a full meal, you can add some ingredients 
            of your own choice, but you need to mention explicitly that they still need to be bought.
            I want this response format: first a name, then a full ingredients list, 
            then a description of how to make the meal`,
        prompt: `these are all products currently in my possession: ${ingredients}`,
    });

    console.log(text);
}

main();
