import { z } from "zod";

/**
 * Zod mirrors of the Prisma models, used with `toCreateData` / `toUpdateData`
 * to turn a request body into a Prisma `data` object.
 *
 * They deliberately describe only the columns a client is allowed to write: id,
 * createdAt and updatedAt are managed by the database, so leaving them out here
 * is what stops a client from setting them.
 *
 * A field is `nullish()` when the column is optional in the schema, which lets
 * one schema serve both create (may be left out) and update (may be set to null
 * to clear the relation).
 */

export const userData = z.object({
	name: z.string(),
	surname: z.string(),
	email: z.string(),
	password: z.string(),
});

export const fridgeData = z.object({
	address: z.string(),
	floor: z.number(),
	capacity: z.number(),
});

export const productData = z.object({
	name: z.string(),
	size: z.number(),
	ownerId: z.string().nullish(),
	fridgeId: z.string().nullish(),
});

export const recipeData = z.object({
	name: z.string(),
	description: z.string(),
	ingredients: z.array(z.string()).optional(),
	steps: z.array(z.string()).optional(),
	ownerId: z.string().nullish(),
});
