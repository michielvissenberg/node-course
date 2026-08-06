import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteProduct = async (id: string) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id },
    });

    if (!existingProduct) {
        throw new NotFoundException("Product not found");
    }

    await prisma.product.delete({
        where: { id },
    });
};