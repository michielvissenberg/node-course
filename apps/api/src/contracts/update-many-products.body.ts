import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

/**
 * Selects the products to hand over in bulk, and who to hand them to.
 *
 * The caller describes *which* products rather than listing ids, so the server
 * decides the set at the moment of the update. The current owner is never part
 * of the body: it is always the authenticated user, which is what makes the
 * filter and the permission check the same thing.
 */
@Exclude()
export class UpdateManyProductsBody {
    @ApiPropertyOptional({ description: "Only hand over products in this fridge" })
    @Expose()
    @IsString()
    @IsOptional()
    public fridgeId?: string;

    @ApiProperty({ description: "The user receiving the products" })
    @Expose()
    @IsString()
    public newOwnerId: string;
}
