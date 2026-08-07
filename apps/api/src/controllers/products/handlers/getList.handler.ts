import { prisma } from "../../../lib/prisma";

export const getList = async (userId, search?: string, fridgeId?: string, fridgeLocation?: string) => {
	let where: any = {};
	if (search) {
		where = {
			name: {
				contains: search,
				mode: "insensitive" as const,
			}
		}
	} else if (userId && !fridgeId) {
		where = {
			ownerId: {
				contains: userId,
				mode: "insensitive" as const,
			}
		}
	} else if (userId && fridgeId) {
		where = {
			AND: [ {
					ownerId: {
						contains: userId,
						mode: "insensitive" as const,
					}
				}, {
					fridgeId: {
						contains: fridgeId,
						mode: "insensitive" as const,
					}
				}
			]
		}
	} else if (userId && fridgeLocation) {
		where = {
			AND: [ {
					ownerId: {
						contains: userId,
						mode: "insensitive" as const,
					}
				}, {
					fridge: {
						every: {
							contains: fridgeLocation,
							mode: "insensitive" as const,
						}
					}
				}
			]
		}
	}
	return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
};