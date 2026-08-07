import { prisma } from "../../../lib/prisma";

export const getList = async (userId, search?: string, fridgeId?: string, fridgeLocation?: string) => {
	return await prisma.product.findMany({
        where: {
        	...(search && { name: { contains: search, mode: 'insensitive' } }),
		    ...(fridgeId && { fridgeId }),
       		...(fridgeLocation && {fridge: {address: { contains: fridgeLocation, mode: 'insensitive' }}})
		}
    });
	// let where: any = {};
	// if (search) {
	// 	where = {
	// 		name: {
	// 			contains: search,
	// 			mode: "insensitive" as const,
	// 		}
	// 	}
	// } else if (userId && !fridgeId) {
	// 	where = {
	// 		ownerId: {
	// 			contains: userId,
	// 			mode: "insensitive" as const,
	// 		}
	// 	}
	// } else if (userId && fridgeId) {
	// 	where = {
	// 		AND: [ {
	// 				ownerId: {
	// 					contains: userId,
	// 					mode: "insensitive" as const,
	// 				}
	// 			}, {
	// 				fridgeId: {
	// 					contains: fridgeId,
	// 					mode: "insensitive" as const,
	// 				}
	// 			}
	// 		]
	// 	}
	// } else if (userId && fridgeLocation) {
	// 	where = {
	// 		AND: [ {
	// 				ownerId: {
	// 					contains: userId,
	// 					mode: "insensitive" as const,
	// 				}
	// 			}, {
	// 				fridge: {
	// 					every: {
	// 						contains: fridgeLocation,
	// 						mode: "insensitive" as const,
	// 					}
	// 				}
	// 			}
	// 		]
	// 	}
	// }
	// return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
};