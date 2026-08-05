import { prisma } from "../../../lib/prisma";

export const getList = async (search?: string) => {
    const where = search
        ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
                {
                    expiresAt: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }
        : {};
    
    return prisma.product.findMany({ where, orderBy: { createdAt: "desc"} });
}