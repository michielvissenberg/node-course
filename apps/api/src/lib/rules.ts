import {
	ForbiddenException,
	ImATeapotException,
	NotFoundException,
} from "@nestjs/common";
import { prisma } from "./prisma";

/**
 * Checks shared by more than one handler.
 *
 * Each one either returns quietly or throws the HTTP exception the client
 * should see, which keeps the handlers themselves a flat list of guards
 * followed by a single write.
 */

/** Throws unless the given user exists. */
export const assertOwnerExists = async (ownerId: string) => {
	const owner = await prisma.user.findUnique({ where: { id: ownerId } });

	if (!owner) {
		throw new NotFoundException("Owner not found");
	}
};

/**
 * Throws unless the fridge exists and still has room for a product of `size`.
 *
 * `excludeProductId` leaves one product out of the total, so updating a product
 * that is already in the fridge does not count its old size twice.
 */
export const assertFitsInFridge = async (
	fridgeId: string,
	size: number,
	excludeProductId?: string
) => {
	const fridge = await prisma.fridge.findUnique({ where: { id: fridgeId } });

	if (!fridge) {
		throw new NotFoundException("Fridge not found");
	}

	const products = await prisma.product.findMany({
		where: {
			fridgeId,
			...(excludeProductId && { id: { not: excludeProductId } }),
		},
	});
	const usedSize = products.reduce((total, product) => total + product.size, 0);

	if (usedSize + size > fridge.capacity) {
		throw new ImATeapotException("Fridge too small");
	}
};

/**
 * Throws unless every id exists and none of the products belong to another
 * user. Products without an owner are free for anyone to touch.
 */
export const assertProductsAreOwnedBy = async (
	ids: string[],
	userId: string,
	message: string
) => {
	const products = await prisma.product.findMany({ where: { id: { in: ids } } });

	if (products.length !== ids.length) {
		throw new NotFoundException("At least one product not found");
	}

	const belongsToSomeoneElse = products.some(
		(product) => product.ownerId != null && product.ownerId !== userId
	);

	if (belongsToSomeoneElse) {
		throw new ForbiddenException(message);
	}
};
