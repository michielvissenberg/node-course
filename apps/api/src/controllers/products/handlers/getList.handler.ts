import { prisma } from "../../../lib/prisma";

export const getList = async (userId, search?: string, fridgeId?: string, fridgeLocation?: string, ownerId?: string) => {
	return await prisma.product.findMany({
        where: {
        	...(search && { name: { contains: search, mode: 'insensitive' } }),
		    ...(fridgeId && { fridgeId }),
       		...(fridgeLocation && {fridge: {address: { contains: fridgeLocation, mode: 'insensitive' }}}),
			...(ownerId && { ownerId }),
		}
    });
};