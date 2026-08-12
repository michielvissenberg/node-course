import { UpdateManyProductsBody } from "../../../contracts/update-many-products.body";
import { prisma } from "../../../lib/prisma";
import { assertOwnerExists } from "../../../lib/rules";

/**
 * Hands every product the caller owns to another user, optionally limited to
 * one fridge.
 *
 * The set is resolved inside the update rather than handed in as a list of ids,
 * so nothing can change between choosing the products and transferring them. It
 * needs no ownership check either: `ownerId: userId` is both the filter and the
 * permission, so a product that is not the caller's simply never matches.
 */
export const updateManyProducts = async (
    body: UpdateManyProductsBody,
    userId: string
) => {
    await assertOwnerExists(body.newOwnerId);

    return prisma.product.updateMany({
        where: {
            ownerId: userId,
            ...(body.fridgeId && { fridgeId: body.fridgeId }),
        },
        data: { ownerId: body.newOwnerId },
    });
};
