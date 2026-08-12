import { prisma } from "../../../lib/prisma";
import { assertProductsAreOwnedBy } from "../../../lib/rules";

export type UpdateManyProductsBody = {
    fridgeId?: string;
    ids: string[];
    newOwnerId: string;
};

export const updateManyProducts = async (
    body: UpdateManyProductsBody,
    userId: string
) => {
    await assertProductsAreOwnedBy(
        body.ids,
        userId,
        "cannot update a product of another user"
    );

    return prisma.product.updateMany({
        where: {
            id: { in: body.ids },
            ...(body.fridgeId && { fridgeId: body.fridgeId }),
        },
        data: { ownerId: body.newOwnerId },
    });
};
