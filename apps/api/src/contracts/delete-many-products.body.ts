import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

/**
 * Selects the products to delete in bulk.
 *
 * The caller describes *which* products rather than listing ids, so the server
 * decides the set at the moment of the delete. The owner is never part of the
 * body: it is always the authenticated user, which is what makes the filter and
 * the permission check the same thing.
 */
@Exclude()
export class DeleteManyProductsBody {
    @ApiPropertyOptional({ description: "Only delete products in this fridge" })
    @Expose()
    @IsString()
    @IsOptional()
    public fridgeId?: string;
}
