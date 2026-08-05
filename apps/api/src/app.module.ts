import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { UserController } from "./controllers/users/user.controller";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { AuthController } from "./controllers/auth/auth.controller";

@Module({
	controllers: [UserController, AuthController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useFactory: (reflector: Reflector) =>
				new TransformInterceptor(reflector),
			inject: [Reflector],
		},
	],
})
export class AppModule {}