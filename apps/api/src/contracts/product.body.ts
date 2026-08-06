import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


@Exclude()
export class ProductBody {
    @ApiProperty()
    @Expose()
    @IsString()
    public name: string;

    @ApiProperty()
    @Expose()
    @IsNumber()
    public size: number;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public ownerId: String;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()    
    public fridgeId: String;
}