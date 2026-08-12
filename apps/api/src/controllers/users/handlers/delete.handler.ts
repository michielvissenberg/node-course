import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteUser = async (id: string, userId: string) => {
	if (userId !== id) {
		throw new ForbiddenException("cannot delete another user");
	}

	const existingUser = await prisma.user.findUnique({ where: { id } });

	if (!existingUser) {
		throw new NotFoundException("User not found");
	}

	await prisma.user.delete({ where: { id } });
};
