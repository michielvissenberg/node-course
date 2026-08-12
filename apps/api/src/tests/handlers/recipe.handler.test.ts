import { beforeEach, describe, it } from "mocha";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { expect } from "chai";

import { create } from "../../controllers/recipes/handlers/create.handler";
import { deleteRecipe } from "../../controllers/recipes/handlers/delete.handler";
import { get } from "../../controllers/recipes/handlers/get.handler";
import { getList } from "../../controllers/recipes/handlers/getList.handler";
import { update } from "../../controllers/recipes/handlers/update.handler";
import { getAiRecipe } from "../../controllers/recipes/handlers/aiRecipe.handler";


const recipeFixtures = [
    {
        name: "test1",
        description: "testDesc1",
        ingredients: ["test", "test1"]
    },
    {
        name: "test2",
        description: "testDesc2",
        ingredients: ["test2", "test3"]
    },
];
const userFixture = {
    name: "testUser",
    surname: "test",
    email: "test@test.com",
    password: "testtest",
}

describe("Handler tests recipe", () => {
    let recipes: any[];
    let user: any;
    beforeEach(async () => {
        // Clean up database
        await prisma.recipe.deleteMany();
        await prisma.user.deleteMany();

        // Create test recipes
        recipes = await Promise.all(
            recipeFixtures.map(async (fixture) => {
                return prisma.recipe.create({
                    data: {
                        name: fixture.name,
                        description: fixture.description,
                        ingredients: fixture.ingredients,
                    },
                });
            })
        );
        user = await prisma.user.create({ 
                data: {
                    name: userFixture.name,
                    surname: userFixture.surname,
                    email: userFixture.email,
                    password: userFixture.password,
                }
            } 
        )
    });

    it("should get recipes", async () => {
        const res = await getList('');
        expect(res.some((x) => x.name === "test2")).true;
    });

    it("should get recipes by id", async () => {
        const res = await get(recipes[1].id);

        expect(res.name).equal("test2");
        expect(res.description).equal("testDesc2");
        expect(res.ingredients[0]).equal("test2");
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
            ingredients: ["testIngredient"],
        };
        const res = await create(body, "1");

        expect(res.name).equal("test3");
        expect(res.description).equal("testDesc3");
        expect(res.ingredients[0]).equal("testIngredient");
    });

    it("should update recipe", async () => {
        const body = {
            description: "testDesc0",
        };
        const id = recipes[0].id;
        const res = await update(id, body, id);

        expect(res.description).equal(body.description);
        expect(res.name).equal("test1");
        expect(res.ingredients[0]).equal("test");
    });

    it("should leave fields the body omits untouched", async () => {
        const id = recipes[0].id;
        await update(id, { steps: ["chop", "fry"] }, id);

        const res = await update(id, { name: "renamed" }, id);

        expect(res.name).equal("renamed");
        expect(res.description).equal("testDesc1");
        expect(res.ingredients).deep.equal(["test", "test1"]);
        expect(res.steps).deep.equal(["chop", "fry"]);
    });

    it("should update recipe steps", async () => {
        const id = recipes[0].id;
        const res = await update(id, { steps: ["chop", "fry"] }, id);

        expect(res.steps).deep.equal(["chop", "fry"]);
        expect(res.name).equal("test1");
    });

    it("should correctly connect a user to a recipe", async () => {
        const userId = (await prisma.user.findFirst())!.id;
        const body = {
            ownerId: userId,
        }
        const id = recipes[0].id;
        const res = await update(id, body, id);
        
        expect(res.ownerId).equal(userId);
        expect(res.id).equal(id);
    });

    it("should delete recipe by id", async () => {
        const initialCount = await prisma.recipe.count();
        await deleteRecipe(recipes[0].id, recipes[0].id);

        const newCount = await prisma.recipe.count();
        expect(initialCount - 1).equal(newCount);
    });

    it("should return an ai-generated recipe", async () => {
        const res = await getAiRecipe("1");
        expect(res.description).to.exist;
        expect(res.ingredients).to.exist;
        expect(res.name).to.exist;
        expect(res.steps).to.exist;
    }).timeout(10000);
});
