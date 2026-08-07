import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const update = async (id: string, body, userId) => {
    if (body.ownerId != null) {
        if (userId !== id) {
            throw new ForbiddenException("cannot update a product for another user");
        }
    }
    
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new NotFoundException("Product not found");
    }
    
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.size !== undefined) updateData.size = body.size;
    // assign fridge to product (put product in fridge/delete product from fridge)
    if (body.fridgeId != null) {
        if (await prisma.fridge.findUnique({ where: { id: body.fridgeId }}) !== null) {
        updateData.fridgeId = body.fridgeId;
        } else {
            throw new NotFoundException("Fridge not found");
        }
    }
    // assign owner to this product (owner gets specific product/owner gifts product)
    if (body.ownerId != null) {
        if (await prisma.user.findUnique({ where: { id: body.ownerId }}) !== null ) {
            updateData.ownerId = body.ownerId;
        } else {
            throw new NotFoundException("Owner not found");
        }
    }
    return prisma.product.update({
        where: { id },
        data: updateData,
    });
};