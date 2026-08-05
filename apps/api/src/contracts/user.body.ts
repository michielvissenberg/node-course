import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

@Exclude()
export class UserBody {
	@ApiProperty()
	@Expose()
	@IsString()
	@IsOptional()
	public name: string;
	
	@ApiProperty()
	@Expose()
	@IsEmail()
	@IsOptional()
	public email: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@Length(8)
	@IsOptional()
	public password: string;
}
