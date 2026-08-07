import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";
import { AppModule } from "../../app.module";
import { prisma } from "../../lib/prisma";

describe("Integration tests product", () => {
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
        await prisma.product.deleteMany(); 
    });

    after(async () => {
        await app.close();
    });

    it("should CRUD products with authentication", async () => {
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
            .post(`/api/products`)
            .set("x-auth", token)
            .send({
                name: "milk",
                size: 1,
            })
            .expect(201)
        const product = await prisma.product.findFirst({
            where: {name: createResponse.name}
        });
        expect(product!.name).equal(createResponse.name);
        expect(product!.size).equal(createResponse.size);

        // Get all products
        const { body: getListRes } = await request(app.getHttpServer())
            .get(`/api/products`)
            .set("x-auth", token)
            .expect(200);
        expect(getListRes.length).equal(1);
        expect(getListRes[0].name).equal("milk");

        // Get the newly created product
        const { body: getResponse } = await request(app.getHttpServer())
            .get(`/api/products/${createResponse.id}`)
            .set("x-auth", token)
            .expect(200);
        expect(getResponse.name).equal("milk");

        // Successfully update product
        const { body: updateResponse } = await request(app.getHttpServer())
            .patch(`/api/products/${createResponse.id}`)
            .send({
                size: 2,
            })
            .set("x-auth", token)
            .expect(200);

        expect(updateResponse.name).equal("milk");
        expect(updateResponse.size).equal(2);

        // Delete the product
        await request(app.getHttpServer())
            .delete(`/api/products/${createResponse.id}`)
            .set("x-auth", token)
            .expect(204);

        // Verify product is deleted
        const { body: getNoneResponse } = await request(app.getHttpServer())
            .get(`/api/products`)
            .set("x-auth", token)
            .expect(200);
        expect(getNoneResponse.length).equal(0);
    });
});

