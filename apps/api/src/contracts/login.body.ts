import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

@Exclude()
export class LoginBody {
    @ApiProperty()
    @Expose()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @Expose()
    @IsString()
    public password: string;
};