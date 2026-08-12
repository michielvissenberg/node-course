import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteManyProducts = async (body: {fridgeId: string | undefined, ids: string[]}, userId: string) => {
    
    const existingProducts = await prisma.product.findMany({
        where: { id: { in: body.ids } },
    });
    
    if (!existingProducts || existingProducts.length !== body.ids.length) {
        throw new NotFoundException("At least one product not found");
    }
    
    existingProducts.map((product) => {
        if (product.ownerId != null) {
            if (product.ownerId !== userId) {
                throw new ForbiddenException("cannot delete a product of another user");
            }
        }
    })
    if (body.fridgeId) {
        const fridge = await prisma.fridge.findUnique({where: {id: body.fridgeId}});
        await prisma.product.deleteMany({
            where: {
                id: {in: body.ids},
                fridgeId: fridge.id,
            }
        })
    } else {
        await prisma.product.deleteMany({
            where: { id: { in: body.ids } },
        });
    }
};
