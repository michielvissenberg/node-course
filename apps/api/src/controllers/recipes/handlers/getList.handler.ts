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
                        description: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
          }
        : {};

    return prisma.recipe.findMany({ where, orderBy: { createdAt: "desc" } });
};