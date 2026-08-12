import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";
import { AppModule } from "../../app.module";
import { prisma } from "../../lib/prisma";

describe("Integration tests recipe", () => {
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

    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.recipe.deleteMany(); 
    });

    after(async () => {
        await app.close();
    });

    it("should CRUD recipes with authentication", async () => {
        await request(app.getHttpServer())
            .post(`/api/users`)
            .send({
                name: "test",
                surname: "1",
                email: "test-user+1@panenco.com",
                password: "real secret stuff",
            })
        // Login to get JWT token
        const { body: loginResponse } = await request(app.getHttpServer())
            .post(`/api/auth/login`)
            .send({
                email: "test-user+1@panenco.com",
                password: "real secret stuff",
            })
        const token = loginResponse.token;

        const { body: createResponse } = await request(app.getHttpServer())
            .post(`/api/recipes`)
            .set("x-auth", token)
            .send({
                name: "spaghetti bolognese",
                description: "cook the spaghetti and warm up the sauce",
            })
            .expect(201)
        const recipe = await prisma.recipe.findFirst({
            where: {name: createResponse.name}
        });
        expect(recipe!.name).equal(createResponse.name);
        expect(recipe!.description).equal(createResponse.description);

        // Get all recipes
        const { body: getListRes } = await request(app.getHttpServer())
            .get(`/api/recipes`)
            .set("x-auth", token)
            .expect(200);
        expect(getListRes.length).equal(1);
        expect(getListRes[0].name).equal("spaghetti bolognese");

        // Get the newly created recipes
        const { body: getResponse } = await request(app.getHttpServer())
            .get(`/api/recipes/${createResponse.id}`)
            .set("x-auth", token)
            .expect(200);
        expect(getResponse.name).equal("spaghetti bolognese");

        // Successfully update recipe
        const { body: updateResponse } = await request(app.getHttpServer())
            .patch(`/api/recipes/${createResponse.id}`)
            .send({
                name: "spaghetti bolognese",
                description: "nice",
            })
            .set("x-auth", token)
            .expect(200);

        expect(updateResponse.name).equal("spaghetti bolognese");
        expect(updateResponse.description).equal("nice");

        // Delete the recipe
        await request(app.getHttpServer())
            .delete(`/api/recipes/${createResponse.id}`)
            .set("x-auth", token)
            .expect(204);

        // Verify recipe is deleted
        const { body: getNoneResponse } = await request(app.getHttpServer())
            .get(`/api/recipes`)
            .set("x-auth", token)
            .expect(200);
        expect(getNoneResponse.length).equal(0);
    });
});

