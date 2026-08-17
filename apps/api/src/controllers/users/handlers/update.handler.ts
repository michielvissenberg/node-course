import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UpdateUserBody } from "../../../contracts/update-user.body";
import { userData } from "../../../contracts/data.schemas";
import { toUpdateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const update = async (
	id: string,
	body: UpdateUserBody,
	userId: string
) => {
	if (userId !== id) {
		throw new ForbiddenException("cannot update another user's credentials");
	}

	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) {
		throw new NotFoundException("User not found");
	}

	const data = toUpdateData(userData, body);

	return prisma.user.update({
		where: { id },
		data: data.password
			? { ...data, password: await bcrypt.hash(data.password, 10) }
			: data,
	});
};
