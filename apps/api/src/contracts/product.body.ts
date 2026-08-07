import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


@Exclude()
export class ProductBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;

    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public size: number;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId?: string;

    @ApiPropertyOptional({nullable: true})
    @Expose()
    @IsString()
    @IsOptional()    
    public fridgeId?: string;
}