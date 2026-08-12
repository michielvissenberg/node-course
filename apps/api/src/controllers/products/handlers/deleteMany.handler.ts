import { DeleteManyProductsBody } from "../../../contracts/delete-many-products.body";
import { prisma } from "../../../lib/prisma";

/**
 * Deletes every product the caller owns, optionally limited to one fridge.
 *
 * The set is resolved inside the delete rather than handed in as a list of ids,
 * so nothing can change between choosing the products and removing them. It
 * needs no ownership check either: `ownerId: userId` is both the filter and the
 * permission, so a product that is not the caller's simply never matches.
 */
export const deleteManyProducts = async (
    body: DeleteManyProductsBody,
    userId: string
) => {
    return prisma.product.deleteMany({
        where: {
            ownerId: userId,
            ...(body.fridgeId && { fridgeId: body.fridgeId }),
        },
    });
};
