import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteFridge = async (id: string) => {
    const existingFridge = await prisma.fridge.findUnique({
        where: { id },
    });

    if (!existingFridge) {
        throw new NotFoundException("Fridge not found");
    }

    await prisma.fridge.delete({
        where: { id },
    });
};