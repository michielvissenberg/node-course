import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const updateManyProducts = async (body: {fridgeId: string | undefined, ids: string[], newOwnerId: string}, userId: string) => {
    const existingProducts = await prisma.product.findMany({
        where: { id: { in: body.ids } },
    });
    
    if (!existingProducts) {
        throw new NotFoundException("Products not found");
    }

    existingProducts.map((product) => {
        if (product.ownerId != null) {
            if (product.ownerId !== userId) {
                throw new ForbiddenException("cannot update a product of another user");
            }
        }
    })
    
    if (body.fridgeId) {
        return prisma.product.updateMany({
            where: {
                id: {in: body.ids},
                fridgeId: body.fridgeId,
            },
            data: {
                ownerId: body.newOwnerId,
            }
        })
    } else {
        return prisma.product.updateMany({
            where: {id: {in: body.ids}},
            data: {
                ownerId: body.newOwnerId,
            }
        })
    }

};
