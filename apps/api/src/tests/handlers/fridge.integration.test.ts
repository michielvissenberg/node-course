import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";
import { AppModule } from "../../app.module";
import { prisma } from "../../lib/prisma";

describe("Integration tests fridge", () => {
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
        await prisma.fridge.deleteMany(); 
        await prisma.user.deleteMany();
    });

    after(async () => {
        await app.close();
    });

    it("should CRUD fridges with authentication", async () => {
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
            .post(`/api/fridges`)
            .set("x-auth", token)
            .send({
                address: "Dennenlaan 1",
                floor: 1,
                capacity: 500,
            })
            .expect(201)
        const fridge = await prisma.fridge.findFirst({
            where: {address: createResponse.address}
        });
        expect(fridge!.floor).equal(createResponse.floor);
        expect(fridge!.capacity).equal(createResponse.capacity);

        // Get all fridges
        const { body: getListRes } = await request(app.getHttpServer())
            .get(`/api/fridges`)
            .set("x-auth", token)
            .expect(200);
        expect(getListRes.length).equal(1);
        expect(getListRes[0].address).equal("Dennenlaan 1");

        // Get the newly created fridge
        const { body: getResponse } = await request(app.getHttpServer())
            .get(`/api/fridges/${createResponse.id}`)
            .set("x-auth", token)
            .expect(200);
        expect(getResponse.address).equal("Dennenlaan 1");

        // Successfully update fridge
        const { body: updateResponse } = await request(app.getHttpServer())
            .patch(`/api/fridges/${createResponse.id}`)
            .send({
                floor: 2,
            })
            .set("x-auth", token)
            .expect(200);

        expect(updateResponse.address).equal("Dennenlaan 1");
        expect(updateResponse.floor).equal(2);
        expect(updateResponse.capacity).equal(500);

        // Delete the fridge
        await request(app.getHttpServer())
            .delete(`/api/fridges/${createResponse.id}`)
            .set("x-auth", token)
            .expect(204);

        // Verify fridge is deleted
        const { body: getNoneResponse } = await request(app.getHttpServer())
            .get(`/api/fridges`)
            .set("x-auth", token)
            .expect(200);
        expect(getNoneResponse.length).equal(0);
    });
});

