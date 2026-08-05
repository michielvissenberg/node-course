import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

@Exclude()
export class UpdateUserBody {
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;
    
    @ApiPropertyOptional()
    @Expose()
    @IsEmail()
    @IsOptional()
    public email: string;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @Length(8)
    @IsOptional()
    public password: string;
}
