import { prisma } from "../../../lib/prisma";
import { assertProductsAreOwnedBy } from "../../../lib/rules";

export type DeleteManyProductsBody = {
    fridgeId?: string;
    ids: string[];
};

export const deleteManyProducts = async (
    body: DeleteManyProductsBody,
    userId: string
) => {
    await assertProductsAreOwnedBy(
        body.ids,
        userId,
        "cannot delete a product of another user"
    );

    await prisma.product.deleteMany({
        where: {
            id: { in: body.ids },
            ...(body.fridgeId && { fridgeId: body.fridgeId }),
        },
    });
};
