import { NotFoundException } from "@nestjs/common";
import { UpdateFridgeBody } from "../../../contracts/update-fridge.body";
import { fridgeData } from "../../../contracts/data.schemas";
import { toUpdateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import { assertCapacityFitsContents } from "../../../lib/rules";

export const update = async (id: string, body: UpdateFridgeBody) => {
    const fridge = await prisma.fridge.findUnique({ where: { id } });

    if (!fridge) {
        throw new NotFoundException("Fridge not found");
    }

    const data = toUpdateData(fridgeData, body);

    // a fridge cannot be shrunk below what is already inside it
    if (data.capacity !== undefined) {
        await assertCapacityFitsContents(id, data.capacity);
    }

    return prisma.fridge.update({
        where: { id },
        data,
    });
};
