import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class RecipeBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;
    
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public description: string;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId?: string;
}
