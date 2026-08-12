import { UserBody } from "../../../contracts/user.body";
import { userData } from "../../../contracts/data.schemas";
import { toCreateData } from "../../../lib/data";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const create = async (body: UserBody) => {
	const data = toCreateData(userData, body);

	return prisma.user.create({
		data: { ...data, password: await bcrypt.hash(data.password, 10) },
	});
};
