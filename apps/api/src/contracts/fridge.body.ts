import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

@Exclude()
export class FridgeBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public address: string;
    
    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public floor: number;

    @ApiPropertyOptional()
    @Expose()
    @IsNumber()
    @IsOptional()
    public capacity: number;

}
