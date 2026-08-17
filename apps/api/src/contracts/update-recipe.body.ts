import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

/**
 * A partial patch of a recipe: every field may be left out, and leaving one out
 * means "do not touch this column".
 *
 * `ownerId` accepts an explicit `null`, which is how a recipe is given up.
 * That is deliberately different from omitting the field.
 */
@Exclude()
export class UpdateRecipeBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name?: string;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public description?: string;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId?: string | null;

    @ApiPropertyOptional()
    @Expose()
    @IsArray()
    @IsOptional()
    public ingredients?: string[];

    @ApiPropertyOptional()
    @Expose()
    @IsArray()
    @IsOptional()
    public steps?: string[];
}
