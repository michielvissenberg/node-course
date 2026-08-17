import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UpdateProductBody } from "../../../contracts/update-product.body";
import { productData } from "../../../contracts/data.schemas";
import { toUpdateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import { assertFitsInFridge, assertOwnerExists } from "../../../lib/rules";

export const update = async (
    id: string,
    body: UpdateProductBody,
    userId: string
) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        throw new NotFoundException("Product not found");
    }

    if (product.ownerId != null && product.ownerId !== userId) {
        throw new ForbiddenException("cannot update a product for another user");
    }

    const data = toUpdateData(productData, body);

    // what the product looks like once the patch is applied: a field the body
    // left out keeps its current value, an explicit null clears it
    const fridgeId = data.fridgeId !== undefined ? data.fridgeId : product.fridgeId;
    const size = data.size ?? product.size;

    // re-checked on every patch, so growing a product already in a fridge
    // cannot push it over capacity either
    if (fridgeId != null) {
        await assertFitsInFridge(fridgeId, size, id);
    }

    if (data.ownerId != null) {
        await assertOwnerExists(data.ownerId);
    }

    return prisma.product.update({ where: { id }, data });
};
