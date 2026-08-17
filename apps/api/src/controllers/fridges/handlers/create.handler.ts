import { FridgeBody } from "../../../contracts/fridge.body";
import { fridgeData } from "../../../contracts/data.schemas";
import { toCreateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";

export const createFridge = async (body: FridgeBody) => {
    return prisma.fridge.create({
        data: toCreateData(fridgeData, body),
    });
};
