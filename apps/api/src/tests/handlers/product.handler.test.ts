import { beforeEach, describe, it } from "mocha";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { expect } from "chai";

import { create } from "../../controllers/products/handlers/create.handler";
import { deleteProduct } from "../../controllers/products/handlers/delete.handler";
import { get } from "../../controllers/products/handlers/get.handler";
import { getList } from "../../controllers/products/handlers/getList.handler";
import { update } from "../../controllers/products/handlers/update.handler";
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
const userFixture = {
        name: "name",
        surname: "surname",
        email: "email@email.com",
        password: "password123",
};
const fridgeFixture = {
        address: "a", 
        capacity: 100, 
        floor: 1,
};

describe("Handler tests product", () => {
    let products: any[];
    let user: any;
    let fridge: any;
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
        user = await prisma.user.create({
            data: {
                name: userFixture.name,
                surname: userFixture.surname,
                email: userFixture.email,
                password: userFixture.password,
            },
        });
        fridge = await prisma.fridge.create({
            data: {
                address: fridgeFixture.address,
                floor: fridgeFixture.floor,
                capacity: fridgeFixture.capacity,
            },
        });
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

    it("should correctly connect to a user", async () => {
        const ownerId = (await prisma.user.findFirst())!.id;
        const body = {
            size: 3,
            ownerId: ownerId,
        };
        const id = products[0].id;
        const res = await update(id, body, "1");

        expect(res.ownerId).equal(ownerId);
    })

    it("should correctly connect to a fridge", async () => {
        const fridgeId = (await prisma.fridge.findFirst())!.id;
        const body = {
            size: 3,
            fridgeId: fridgeId,
        };
        const id = products[0].id;
        const res = await update(id, body, "1");

        expect(res.fridgeId).equal(fridgeId);
    })

    it("should keep the product in its fridge when the body omits fridgeId", async () => {
        const id = products[0].id;
        await update(id, { fridgeId: fridge.id }, "1");

        const res = await update(id, { name: "renamed" }, "1");

        expect(res.name).equal("renamed");
        expect(res.fridgeId).equal(fridge.id);
    })

    it("should take the product out of its fridge on an explicit null", async () => {
        const id = products[0].id;
        await update(id, { fridgeId: fridge.id }, "1");

        const res = await update(id, { fridgeId: null }, "1");

        expect(res.fridgeId).equal(null);
    })

    it("should fail when growing a product already in a fridge past capacity", async () => {
        const id = products[0].id;
        await update(id, { fridgeId: fridge.id }, "1");

        try {
            await update(id, { size: 101 }, "1");
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            return
        }
        expect(true, "should have thrown an error").false;
    })

    it("should fail when putting too large product in fridge", async () => {
        try {
            await create("1", {name: "test", size: 101, fridgeId: fridge.id})
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            // the rejected product must not have been written to the fridge
            const stored = await prisma.product.findMany({where: {fridgeId: fridge.id}});
            expect(stored).length(0);
            return
        }
        expect(true, "should have thrown an error").false;
    })

    it("should allow a product that exactly fills the fridge", async () => {
        const res = await create("1", {name: "test", size: 100, fridgeId: fridge.id});

        expect(res.fridgeId).equal(fridge.id);
    })

    it("should fail when a product no longer fits next to what is already inside", async () => {
        await create("1", {name: "first", size: 60, fridgeId: fridge.id});

        try {
            await create("1", {name: "second", size: 41, fridgeId: fridge.id})
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            // only the first product may be in the fridge
            const stored = await prisma.product.findMany({where: {fridgeId: fridge.id}});
            expect(stored).length(1);
            expect(stored[0].name).equal("first");
            return
        }
        expect(true, "should have thrown an error").false;
    })

    it("should fail when updating too large product into fridge", async () => {
        try {
            const id = products[0].id;
            await update(id, {name: "test1", size: 101, fridgeId: fridge.id}, "1");
        } catch (error: any) {
            expect(error.message).equal("Fridge too small")
            return
        }
        expect(true, "should have thrown an error").false;
    })

    it("should hand over every product the caller owns", async () => {
        const owner = await prisma.user.create({
            data: { name: "owner", surname: "o", email: "owner@test.com", password: "x" },
        });
        await prisma.product.updateMany({
            where: { id: { in: [products[0].id, products[1].id] } },
            data: { ownerId: owner.id },
        });

        const res = await updateManyProducts({ newOwnerId: user.id }, owner.id);

        expect(res.count).equal(2);
        const handedOver = await prisma.product.findMany({ where: { ownerId: user.id } });
        expect(handedOver).length(2);
    })

    it("should not hand over products belonging to someone else", async () => {
        const stranger = await prisma.user.create({
            data: { name: "stranger", surname: "s", email: "stranger@test.com", password: "x" },
        });
        await prisma.product.update({
            where: { id: products[0].id },
            data: { ownerId: stranger.id },
        });

        const res = await updateManyProducts({ newOwnerId: user.id }, "not-the-owner");

        expect(res.count).equal(0);
        const untouched = await prisma.product.findUnique({ where: { id: products[0].id } });
        expect(untouched!.ownerId).equal(stranger.id);
    })

    it("should only hand over products in the given fridge", async () => {
        await prisma.product.updateMany({
            where: { id: { in: [products[0].id, products[1].id] } },
            data: { ownerId: user.id },
        });
        await prisma.product.update({
            where: { id: products[0].id },
            data: { fridgeId: fridge.id },
        });
        const receiver = await prisma.user.create({
            data: { name: "receiver", surname: "r", email: "receiver@test.com", password: "x" },
        });

        const res = await updateManyProducts(
            { fridgeId: fridge.id, newOwnerId: receiver.id },
            user.id
        );

        expect(res.count).equal(1);
        const stillMine = await prisma.product.findUnique({ where: { id: products[1].id } });
        expect(stillMine!.ownerId).equal(user.id);
    })

    it("should fail when handing products to a user that does not exist", async () => {
        try {
            await updateManyProducts({ newOwnerId: randomUUID() }, user.id);
        } catch (error: any) {
            expect(error.message).equal("Owner not found")
            return
        }
        expect(true, "should have thrown an error").false;
    })

    it("should delete every product the caller owns", async () => {
        await prisma.product.updateMany({
            where: { id: { in: [products[0].id, products[1].id] } },
            data: { ownerId: user.id },
        });

        const res = await deleteManyProducts({}, user.id);

        expect(res.count).equal(2);
        expect(await prisma.product.count()).equal(0);
    })

    it("should not delete products belonging to someone else", async () => {
        const stranger = await prisma.user.create({
            data: { name: "stranger", surname: "s", email: "stranger2@test.com", password: "x" },
        });
        await prisma.product.update({
            where: { id: products[0].id },
            data: { ownerId: stranger.id },
        });

        const res = await deleteManyProducts({}, user.id);

        expect(res.count).equal(0);
        expect(await prisma.product.count()).equal(2);
    })

    it("should only delete products in the given fridge", async () => {
        await prisma.product.updateMany({
            where: { id: { in: [products[0].id, products[1].id] } },
            data: { ownerId: user.id },
        });
        await prisma.product.update({
            where: { id: products[0].id },
            data: { fridgeId: fridge.id },
        });

        const res = await deleteManyProducts({ fridgeId: fridge.id }, user.id);

        expect(res.count).equal(1);
        const remaining = await prisma.product.findMany();
        expect(remaining).length(1);
        expect(remaining[0].id).equal(products[1].id);
    })
});
