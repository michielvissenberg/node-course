import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const update = async (id: string, body, userId) => {
	if (id != null) {
		if (userId !== id) {
			throw new ForbiddenException("cannot update another user's credentials");
		}
	}
	
	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user) {
		throw new NotFoundException("User not found");
	}
	
	const updateData: any = {};
	if (body.name !== undefined) updateData.name = body.name;
	if (body.email !== undefined) updateData.email = body.email;
	if (body.password !== undefined) {
		updateData.password = await bcrypt.hash(body.password, 10);
	}

	return prisma.user.update({
		where: { id },
		data: updateData,
	});
};