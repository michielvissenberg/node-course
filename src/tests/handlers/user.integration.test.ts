import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";

import { AppModule } from "../../app.module";
import { User, UserStore } from "../../controllers/users/handlers/user.store";

describe("Integration tests", () => {
	describe("User Tests", () => {
		let app: INestApplication;

		before(async () => {
			const moduleFixture: TestingModule = await Test.createTestingModule(
				{
					imports: [AppModule],
				}
			).compile();

			app = moduleFixture.createNestApplication();

			// Apply the same configuration as in main.ts
			app.useGlobalPipes(
				new ValidationPipe({
					whitelist: true,
					forbidNonWhitelisted: true,
					transform: true,
					transformOptions: { exposeUnsetFields: false },
				})
			);

			app.enableCors({
				origin: "*",
				credentials: true,
				exposedHeaders: ["x-auth"],
			});

			app.setGlobalPrefix("api");

			await app.init();
		});

		beforeEach(() => {
			UserStore.users = []; // Clean up users before each test
		});

		after(async () => {
			await app.close();
		});

		it("should CRUD users", async () => {
			// Successfully create new user
			const { body: createResponse } = await request(app.getHttpServer())
				.post(`/api/users`)
				.send({
					name: "test",
					email: "test-user+1@panenco.com",
					password: "real secret stuff",
				} as User)
				.expect(201);

			expect(
				UserStore.users.some((x) => x.email === createResponse.email)
			).true;

			// Get the newly created user
			const { body: getResponse } = await request(app.getHttpServer())
				.get(`/api/users/${createResponse.id}`)
				.expect(200);
			expect(getResponse.name).equal("test");

			// Get all users
			const { body: getListRes } = await request(app.getHttpServer())
				.get(`/api/users`)
				.expect(200);
			expect(getListRes.length).equal(1);
			expect(getListRes[0].name).equal("test");

			// Successfully update user
			const { body: updateResponse } = await request(app.getHttpServer())
				.patch(`/api/users/${createResponse.id}`)
				.send({
					email: "test-user+1@panenco.com",
				} as User)
				.expect(200);
			
			expect(updateResponse.name).equal("test");
			expect(updateResponse.email).equal("test-user+1@panenco.com");
			expect(updateResponse.password).undefined; // password excluded from response

			// Delete the newly created user
			await request(app.getHttpServer())
				.delete(`/api/users/${createResponse.id}`)
				.expect(204);

			// Get all users again after deleted the only user
			const { body: getNoneResponse } = await request(app.getHttpServer())
				.get(`/api/users`)
				.expect(200);
			expect(getNoneResponse.length).equal(0);
		});
	});
});
