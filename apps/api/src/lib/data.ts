import { z } from "zod";

const dropUndefined = <T>(value: object): T =>
	Object.fromEntries(
		Object.entries(value).filter(([, field]) => field !== undefined)
	) as T;

/**
 * Shapes a request body into a Prisma `data` object for a create.
 *
 * Required columns stay required, optional ones may be left out, and anything
 * the schema does not declare is stripped. Bodies have already been validated
 * by the global ValidationPipe, so this is about shape rather than trust: it
 * replaces the hand-rolled `const data: any = {}` blocks and gives the handler
 * a typed object Prisma can accept directly.
 */
export const toCreateData = <Schema extends z.ZodObject<any>>(
	schema: Schema,
	body: unknown
): z.infer<Schema> => dropUndefined<z.infer<Schema>>(schema.parse(body));

/**
 * Shapes a request body into a Prisma `data` object for an update.
 *
 * Every column becomes optional and whatever the client left out is dropped, so
 * a partial patch never overwrites a column it did not mention. An explicit
 * `null` is kept, since that is how a relation is cleared.
 */
export const toUpdateData = <Schema extends z.ZodObject<any>>(
	schema: Schema,
	body: unknown
): Partial<z.infer<Schema>> =>
	dropUndefined<Partial<z.infer<Schema>>>(schema.partial().parse(body));
