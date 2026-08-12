import { NotFoundException } from "@nestjs/common";
import { UpdateFridgeBody } from "../../../contracts/update-fridge.body";
import { fridgeData } from "../../../contracts/data.schemas";
import { toUpdateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body: UpdateFridgeBody) => {
    const fridge = await prisma.fridge.findUnique({ where: { id } });

    if (!fridge) {
        throw new NotFoundException("Fridge not found");
    }

    return prisma.fridge.update({
        where: { id },
        data: toUpdateData(fridgeData, body),
    });
};
