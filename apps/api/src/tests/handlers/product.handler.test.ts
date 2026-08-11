import { beforeEach, describe, it } from "mocha";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { expect } from "chai";

import { create } from "../../controllers/products/handlers/create.handler";
import { deleteProduct } from "../../controllers/products/handlers/delete.handler";
import { get } from "../../controllers/products/handlers/get.handler";
import { getList } from "../../controllers/products/handlers/getList.handler";
import { update } from "../../controllers/products/handlers/update.handler";
import { createFridge} from "../../controllers/fridges/handlers/create.handler";
import { updateManyProducts } from "../../controllers/products/handlers/updateMany.handler";
import { deleteManyProducts } from "../../controllers/products/handlers/deleteMany.handler";

const productFixtures = [
    {
        name: "test1",
        size: 1,

    },
    {
        name: "test2",
        size: 2,
    },
];

describe("Handler tests product", () => {
    let products: any[];
    beforeEach(async () => {
        // Clean up database
        await prisma.product.deleteMany();
        await prisma.fridge.deleteMany();
        await prisma.user.deleteMany();

        // Create test products
        products = await Promise.all(
            productFixtures.map(async (fixture) => {
                return prisma.product.create({
                    data: {
                        name: fixture.name,
                        size: fixture.size,
                    },
                });
            })
        );
    });

    it("should get products", async () => {
        const res = await getList('');
        expect(res.some((x) => x.name === "test2")).true;
    });

    it("should get product by id", async () => {
        const res = await get(products[1].id);

        expect(res.name).equal("test2");
        expect(res.size).equal(2);
    });

    it("should fail when getting product by unknown id", async () => {
        try {
            await get(randomUUID());
        } catch (error: any) {
            expect(error.message).equal("product not found");
            return;
        }
        expect(true, "should have thrown an error").false;
    });

    it("should create product", async () => {
        const body = {
            name: "newProduct",
            size: 3,
        };
        const res = await create("1", body);

        expect(res.name).equal("newProduct");
        expect(res.size).equal(3);
    });

    it("should update product", async () => {
        const body = {
            size: 3,
        };
        const id = products[0].id;
        const res = await update(id, body, "1");

        expect(res.size).equal(body.size);
        expect(res.name).equal("test1");
    });

    it("should delete product by id", async () => {
        const initialCount = await prisma.product.count();
        await deleteProduct(products[0].id, "1");

        const newCount = await prisma.product.count();
        expect(initialCount - 1).equal(newCount);
    });

    it("should fail when putting too large product in fridge", async () => {
        const fridge = await createFridge({address: "a", capacity: 1, floor: 1})
        try {
            await create("1", {name: "test", size: 2, fridgeId: fridge.id})
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            return
        }
        expect(true, "should have thrown an error").false;
    })
    it("should fail when updating too large product into fridge", async () => {
        const fridge = await createFridge({address: "a", capacity: 1, floor: 1})
        try {
            const id = products[0].id;
            await update(id, {name: "test1", size: 1.1, fridgeId: fridge.id}, "1");
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            return
        }
        expect(true, "should have thrown an error").false;
    })
    it("should update multiple entries' owner ids", async () => {
        const user = prisma.user.create({
            data: {
                name: "name",
                surname: "surname",
                email: "email@email.com",
                password: "password123",
            },
        })
        const userId = (await user).id;

        const ids: string[] = [products[0].id, products[1].id];
        const res = await updateManyProducts( {fridgeId: undefined, ids: ids, newOwnerId: userId}, "1");

        expect(res.count).equal(2);
    })
    it("should delete multiple entries", async () => {
        const ids: string[] = [products[0].id, products[1].id];
        const res = await deleteManyProducts( {fridgeId: undefined, ids: ids}, "1");

        const count = await prisma.product.count();
        expect(0).equal(count);
    })
});
