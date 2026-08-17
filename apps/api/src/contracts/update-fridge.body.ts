import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

/**
 * A partial patch of a fridge: every field may be left out, and leaving one out
 * means "do not touch this column".
 */
@Exclude()
export class UpdateFridgeBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public address?: string;

    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public floor?: number;

    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public capacity?: number;
}
