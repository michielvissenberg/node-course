import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class FridgeBody {
    @ApiProperty()
    @Expose()
    @IsString()
    public address: string;
    
    @ApiProperty()
    @Expose()
    @IsNumber()
    public floor: number;

    @ApiProperty()
    @Expose()
    @IsNumber()
    public capacity: number;

}
