import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class RecipeBody {
    @ApiProperty()
    @Expose()
    @IsString()
    public name: string;
    
    @ApiProperty()
    @Expose()
    @IsString()
    public description: string;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId?: string;
}
