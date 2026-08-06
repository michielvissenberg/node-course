import { UserBody } from "../../../contracts/user.body";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const create = async (body: UserBody) => {
	const hashedPassword = await bcrypt.hash(body.password, 10);

	const user = await prisma.user.create({
		data: {
			name: body.name,
			surname: body.surname,
			email: body.email,
			password: hashedPassword,
		},
	});

	return user;
};
