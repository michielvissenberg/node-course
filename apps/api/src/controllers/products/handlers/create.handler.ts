import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ProductBody } from "../../../contracts/product.body";
import { prisma } from "../../../lib/prisma";


export const create = async (userId: string, body: ProductBody) => {
    if (body.ownerId != null) {
        if (userId !== body.ownerId) {
            throw new ForbiddenException("cannot create a product for another user");
        }
    }

    const data: any = {};
    
    if (body.name !== undefined) data.name = body.name;
    if (body.size !== undefined) data.size = body.size;
    // assign fridge to product (put product in fridge/delete product from fridge)
    if (body.fridgeId != null) {
        if (await prisma.fridge.findUnique({ where: { id: body.fridgeId }}) !== null) {
            data.fridgeId = body.fridgeId;
        } else {
            throw new NotFoundException("Fridge not found");
        }
    }
    // assign owner to this product (owner gets specific product/owner gifts product)
    if (body.ownerId != null) {
        if (await prisma.user.findUnique({ where: { id: body.ownerId }}) !== null ) {
            data.ownerId = body.ownerId;
        } else {
            throw new NotFoundException("Owner not found");
        }
    }
    
    const product = await prisma.product.create({
        data: data,
    });

    return product;
};