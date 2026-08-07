import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteProduct = async (id: string, userId: string) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id },
    });

    if (!existingProduct) {
        throw new NotFoundException("Product not found");
    }

    if (existingProduct.ownerId != null) {
        if (id !== userId) {
            throw new ForbiddenException("cannot delete a product of another user");
        }
    }
    
    await prisma.product.delete({
        where: { id },
    });
};