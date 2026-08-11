import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Clear existing data
	await prisma.user.deleteMany();
	await prisma.product.deleteMany();
	await prisma.fridge.deleteMany();
	await prisma.recipe.deleteMany();
	
	// Create initial users
	const users = await Promise.all([
		prisma.user.create({
			data: {
				name: "John",
				surname: "Doe",
				email: "john@example.com",
				password: await bcrypt.hash("password123", 10),
				products: {
					create: [
						{name: "apple", size: 0.15},
						{name: "cookie", size: 0.04},
						{name: "bolognese sauce", size: 0.5},
						{name: "burger", size: 1},
						{name: "lettuce", size: 3},
					]
				},
				recipes: {
					create: [
						{name: "spaghetti bolognese", description: "cook the pasta and add the warmed up bolognese sauce", ingredients: ["spaghetti", "bolognese sauce"]
						},
						{name: "burger", description: "bake the burger, put some cheddar on it and put it in a patty with some vegetables", ingredients: ["burger", "patty", "salad", "tomato", "cheddar cheese"]
						}
					]
				}
			},
		}),
		prisma.user.create({
			data: {
				name: "Jane",
				surname: "Smith",
				email: "jane@example.com",
				password: await bcrypt.hash("password456", 10),
				products: {
					create: [
						{name: "pear", size: 0.2},
						{name: "cola can", size: 0.33},
						{name: "tomato", size: 2},
						{name: "cheese", size: 0.5},
					]
				},
			},
		}),
		prisma.user.create({
			data: {
				name: "Michiel",
				surname: "Vissenberg",
				email: "michiel@vissenberg.be",
				password: await bcrypt.hash("visvisvis", 10),
			},
		}),
	]);

	console.log("Seeded users:", users);

	const fridges = await Promise.all([
		prisma.fridge.create({
			data: {
				address: "Dennenlaan 1",
				floor: 1,
				capacity: 500,
				products: { connect: [
					{id: (await prisma.product.findFirst(
						{where: {name: "tomato"}}
					))!.id},
					{id: (await prisma.product.findFirst(
						{where: {name: "cheese"}}
					))!.id},
				]}
			}
		}),
		prisma.fridge.create({
			data: {
				address: "Dennenlaan 2",
				floor: 2,
				capacity: 600,
				products: { connect: [
					{id: (await prisma.product.findFirst(
						{where: {name: "pear"}}
					))!.id}, 
					{id: (await prisma.product.findFirst(
						{where: {name: "apple"}}
					))!.id},
					{id: (await prisma.product.findFirst(
						{where: {name: "bolognese sauce"}}
					))!.id},
					{id: (await prisma.product.findFirst(
						{where: {name: "cola can"}}
					))!.id},
					{id: (await prisma.product.findFirst(
						{where: {name: "burger"}}
					))!.id},
					{id: (await prisma.product.findFirst(
						{where: {name: "lettuce"}}
					))!.id},
				]}
			}
		}),
	]);

	console.log("Seeded fridges:", fridges);
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
    