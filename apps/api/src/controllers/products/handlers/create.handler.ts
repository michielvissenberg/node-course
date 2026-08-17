import { ForbiddenException } from "@nestjs/common";
import { ProductBody } from "../../../contracts/product.body";
import { productData } from "../../../contracts/data.schemas";
import { toCreateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import { assertFitsInFridge, assertOwnerExists } from "../../../lib/rules";

export const create = async (userId: string, body: ProductBody) => {
    if (body.ownerId != null && userId !== body.ownerId) {
        throw new ForbiddenException("cannot create a product for another user");
    }

    const data = toCreateData(productData, body);

    // assign fridge to product (put product in fridge/delete product from fridge)
    if (data.fridgeId != null) {
        await assertFitsInFridge(data.fridgeId, data.size);
    }

    // assign owner to this product (owner gets specific product/owner gifts product)
    if (data.ownerId != null) {
        await assertOwnerExists(data.ownerId);
    }

    return prisma.product.create({ data });
};
