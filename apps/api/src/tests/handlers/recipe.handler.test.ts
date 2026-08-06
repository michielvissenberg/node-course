import { beforeEach, describe, it } from "mocha";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { expect } from "chai";


const recipeFixtures = [
    {
        name: "test1",
        description: "testDesc1",
    },
    {
        name: "test2",
        description: "testDesc2",
    },
];

describe("Handler tests recipe", () => {
    let recipes: any[];
    beforeEach(async () => {
        // Clean up database
        await prisma.recipe.deleteMany();

        // Create test recipes
        recipes = await Promise.all(
            recipeFixtures.map(async (fixture) => {
                return prisma.recipe.create({
                    data: {
                        name: fixture.name,
                        description: fixture.description,
                    },
                });
            })
        );
    });

    it("should get recipes", async () => {
        const res = await getList('');
        expect(res.some((x) => x.name === "test2")).true;
    });

    it("should get recipes by id", async () => {
        const res = await get(recipes[1].id);

        expect(res.name).equal("test2");
        expect(res.description).equal("testDesc2");
    });

    it("should fail when getting recipe by unknown id", async () => {
        try {
            await get(randomUUID());
        } catch (error: any) {
            expect(error.message).equal("recipe not found");
            return;
        }
        expect(true, "should have thrown an error").false;
    });

    it("should create recipe", async () => {
        const body = {
            name: "test3",
            description: "testDesc3",
        };
        const res = await create(body);

        expect(res.name).equal("test3");
        expect(res.size).equal("testDesc3");
    });

    it("should update recipe", async () => {
        const body = {
            description: "testDesc0",
        };
        const id = recipes[0].id;
        const res = await update(id, body);

        expect(res.description).equal(body.description);
        expect(res.name).equal("test1");
    });

    it("should delete recipe by id", async () => {
        const initialCount = await prisma.recipe.count();
        await deleteRecipe(recipes[0].id);

        const newCount = await prisma.recipe.count();
        expect(initialCount - 1).equal(newCount);
    });

});
