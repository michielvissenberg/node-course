import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body) => {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new NotFoundException("Product not found");
    }
    
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.size !== undefined) updateData.size = body.size;

    return prisma.product.update({
        where: { id },
        data: updateData,
    });
};