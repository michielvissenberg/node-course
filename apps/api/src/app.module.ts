import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { UserController } from "./controllers/users/user.controller";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { AuthController } from "./controllers/auth/auth.controller";
import { ProductController } from "./controllers/products/product.controller";
import { FridgeController } from "./controllers/fridges/fridge.controller";
import { RecipeController } from "./controllers/recipes/recipe.controller";

@Module({
	controllers: [UserController, ProductController, FridgeController, RecipeController, AuthController],
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