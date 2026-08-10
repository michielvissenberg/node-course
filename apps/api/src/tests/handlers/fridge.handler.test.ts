import { beforeEach, describe, it } from "mocha";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { expect } from "chai";

import { createFridge } from "../../controllers/fridges/handlers/create.handler";
import { deleteFridge } from "../../controllers/fridges/handlers/delete.handler";
import { get } from "../../controllers/fridges/handlers/get.handler";
import { getList } from "../../controllers/fridges/handlers/getList.handler";
import { update } from "../../controllers/fridges/handlers/update.handler";

const fridgeFixtures = [
    {
        address: "Dennenlaan 1",
        floor: 1,
        capacity: 100,
    },
    {
        address: "Dennenlaan 2",
        floor: 2,
        capacity: 200,
    },
];

describe("Handler tests fridge", () => {
    let fridges: any[];
    beforeEach(async () => {
        // Clean up database
        await prisma.fridge.deleteMany();

        // Create test fridges
        fridges = await Promise.all(
            fridgeFixtures.map(async (fixture) => {
                return prisma.fridge.create({
                    data: {
                        address: fixture.address,
                        floor: fixture.floor,
                        capacity: fixture.capacity,
                    },
                });
            })
        );
    });

    it("should get fridges", async () => {
        const res = await getList('');
        expect(res.some((x) => x.address === "Dennenlaan 2")).true;
    });

    it("should get fridge by id", async () => {
        const res = await get(fridges[1].id);

        expect(res.address).equal("Dennenlaan 2");
        expect(res.floor).equal(2);
        expect(res.capacity).equal(200)
    });

    it("should fail when getting fridge by unknown id", async () => {
        try {
            await get(randomUUID());
        } catch (error: any) {
            expect(error.message).equal("fridge not found");
            return;
        }
        expect(true, "should have thrown an error").false;
    });

    it("should create fridge", async () => {
        const body = {
            address: "Dennenlaan 3",
            floor: 3,
            capacity: 300,
        };
        const res = await createFridge(body);

        expect(res.address).equal("Dennenlaan 3");
        expect(res.floor).equal(3);
        expect(res.capacity).equal(300);
    });

    it("should update fridge", async () => {
        const body = {
            capacity: 1,
        };
        const id = fridges[0].id;
        const res = await update(id, body);

        expect(res.capacity).equal(body.capacity);
        expect(res.address).equal("Dennenlaan 1");
    });

    it("should delete fridge by id", async () => {
        const initialCount = await prisma.fridge.count();
        await deleteFridge(fridges[0].id);

        const newCount = await prisma.fridge.count();
        expect(initialCount - 1).equal(newCount);
    });

});
