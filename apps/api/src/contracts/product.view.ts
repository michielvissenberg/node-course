import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";


@Exclude()
export class ProductView {
    @ApiProperty({ format: "uuid" })
    @Expose()
    @IsUUID()
    public id: string;
    
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
    public ownerId: string;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()    
    public fridgeId: string;
}