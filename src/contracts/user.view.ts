import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, IsString } from "class-validator";

@Exclude()
export class UserView {
	@Expose()
	@IsNumber()
	id: number;

	@Expose()
	@IsString()
	name: string;

	@Expose()
	@IsEmail()
	email: string;
}