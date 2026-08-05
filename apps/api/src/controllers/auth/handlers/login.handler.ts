import { UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { LoginBody } from "../../../contracts/login.body";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const createToken = async (body: LoginBody) => {
	const user = await prisma.user.findUnique({
		where: { email: body.email },
	});

	if (!user) {
		throw new UnauthorizedException("Invalid credentials");
	}

	const isPasswordValid = await bcrypt.compare(body.password, user.password);
	if (!isPasswordValid) {
		throw new UnauthorizedException("Invalid credentials");
	}

	const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
		expiresIn: "1h",
	});

	return {
		token,
		expiresIn: 36000, 
	};
};