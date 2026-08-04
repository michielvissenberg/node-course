import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

@Exclude()
export class UserBody {
	@Expose()
	@IsString()
	@IsOptional()
	public name: string;

	@Expose()
	@IsEmail()
	@IsOptional()
	public email: string;

	@Expose()
	@IsString()
	@Length(8)
	@IsOptional()
	public password: string;
}
