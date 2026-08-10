import { FridgeBody } from "../../../contracts/fridge.body";
import { prisma } from "../../../lib/prisma";

export const createFridge = async (body: FridgeBody) => {
    const fridge = await prisma.fridge.create({
        data: {
            address: body.address,
            floor: body.floor,
            capacity: body.capacity,
        },
    });

    return fridge;
};
