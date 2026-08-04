import { User, UserStore} from '../../controllers/users/handlers/user.store';
import { App } from '../../app'
import supertest from 'supertest';
import {expect} from 'chai';

describe("Integration tests", () => {
	describe("User Tests", () => {
        let request: any;
		beforeEach(() => {
			UserStore.users = [];
			const app = new App();
			request = supertest(app.host);
		});
        it("should CRUD users", async () => {
            await request.post(`/api/users`).expect(401);

            const { body: createResponse } = await request
                .post(`/api/users`)
                .send({
                    name: "test",
                    email: "test-user+1@panenco.com",
                    password: "real secret stuff",
                } as User)
                .set("auth", "api-key")
                .expect(200);

            expect(UserStore.users.some((x) => x.email === createResponse.email)).true;

            const { body: getResponse } = await request
                .get(`/api/users/${createResponse.id}`)
                .expect(200);
            expect(getResponse.name).equal("test");

            const { body: updateResponse } = await request
                .patch(`/api/users/${createResponse.id}`)
                .send({
                    email: "test-user+updated@panenco.com",
                } as User)
                .expect(200);

            expect(updateResponse.name).equal("test");
            expect(updateResponse.email).equal("test-user+updated@panenco.com");
            expect(updateResponse.password).undefined; 

            const { body: getAllResponse } = await request
                .get(`/api/users`)
                .expect(200);

            const newUser = getAllResponse.find(
                (x: User) => x.name === getResponse.name
            );
            expect(newUser).not.undefined;
            expect(newUser.email).equal("test-user+updated@panenco.com");
            await request.delete(`/api/users/${createResponse.id}`).expect(204);

            const { body: getNoneResponse } = await request
                .get(`/api/users`)
                .expect(200);
            expect(getNoneResponse.length).equal(0);
        });
	});
});
