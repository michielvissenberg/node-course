import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

@Exclude()
export class UserBody {
	@ApiProperty()
	@Expose()
	@IsString()
	public name: string;

	@ApiProperty()
	@Expose()
	@IsString()
	public surname: string;
	
	@ApiProperty()
	@Expose()
	@IsEmail()
	public email: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@Length(8)
	public password: string;
}
