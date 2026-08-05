import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";


@Exclude()
export class ProductBody {
    @ApiProperty()
    @Expose()
    @IsString()
    public name: string;

    @ApiProperty()
    @Expose()
    @IsString()
    public expiresAt: string;
}