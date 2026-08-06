import { ProductBody } from "../../../contracts/product.body";
import { prisma } from "../../../lib/prisma";


export const create = async (body: ProductBody) => {
    const product = await prisma.product.create({
        data: {
            name: body.name,
            size: body.size,
        },
    });

    return product;
};