import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

@Exclude()
export class UserView {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	name: string;

	@Expose()
	@IsEmail()
	email: string;
}