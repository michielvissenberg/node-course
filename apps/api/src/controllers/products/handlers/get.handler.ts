import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const get = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
    }) 
    
    if (!product) {
        throw new NotFoundException("product not found");
    }
    
    return product;    
};
