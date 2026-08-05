import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Clear existing data
	await prisma.user.deleteMany();
	await prisma.product.deleteMany();
	
	// Create initial users
	const users = await Promise.all([
		prisma.user.create({
			data: {
				name: "John Doe",
				email: "john@example.com",
				password: await bcrypt.hash("password123", 10),
			},
		}),
		prisma.user.create({
			data: {
				name: "Jane Smith",
				email: "jane@example.com",
				password: await bcrypt.hash("password456", 10),
			},
		}),
	]);

	console.log("Seeded users:", users);
	
	const products = await Promise.all([
		prisma.product.create({
			data: {
				name: "apple",
				expiresAt: "2026, 9, 1",
			},
		}),
		prisma.product.create({
			data: {
				name: "cookie",
				expiresAt: "2026, 12, 12",
			}
		}),
	]);

	console.log("Seeder products:", products);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
    