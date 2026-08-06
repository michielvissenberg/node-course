import { prisma } from "../../../lib/prisma";

export const getList = async (search?: string) => {
    const where = search
        ? {
                OR: [
                    {
                        address: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
          }
        : {};

    return prisma.fridge.findMany({ where, orderBy: { createdAt: "desc" } });
};