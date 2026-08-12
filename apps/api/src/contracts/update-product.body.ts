import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

/**
 * A partial patch of a product: every field may be left out, and leaving one
 * out means "do not touch this column".
 *
 * `ownerId` and `fridgeId` accept an explicit `null`, which is how a client
 * gives a product away or takes it out of its fridge. That is deliberately
 * different from omitting the field.
 */
@Exclude()
export class UpdateProductBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name?: string;

    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public size?: number;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId?: string | null;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public fridgeId?: string | null;
}
