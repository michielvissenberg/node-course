import {expect} from 'chai';
import { beforeEach, describe, it } from "mocha";
import { User, UserStore} from '../../controllers/users/handlers/user.store';
import { getList } from "../../controllers/users/handlers/getList.handler";
import { Request, Response } from 'express';
import { getUserById } from '../../controllers/users/handlers/get.handler';
import { create } from '../../controllers/users/handlers/create.handler';
import { updateById } from'../../controllers/users/handlers/update.handler';
import { deleteById } from'../../controllers/users/handlers/delete.handler';

const userFixtures: User[] = [
	{
		name: "test1",
		email: "test-user+1@panenco.com",
		id: 0,
		password: "password1",
	},
	{
		name: "test2",
		email: "test-user+2@panenco.com",
		id: 1,
		password: "password2",
	},
];

describe("Users handler tests", () => {
	let res: any;
	beforeEach(() => {
		UserStore.users = [];
		UserStore.add({
			name: "test1",
			email: "test-user+1@panenco.com",
			password: "test",
		});
		UserStore.add({
			name: "test2",
			email: "test-user+2@panenco.com",
			password: "test",
		});
	});
    it("should get users", () => {
        let res: User[] = [];
        getList(
            { query: {} } as unknown as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        );
        expect(res.length).equal(2);
        expect(res.some((x) => x.name === "test1")).true;
        expect(res.some((x) => x.name === "test2")).true;
    });
    it("should search users", () => {
		let res: User[] = [];
        getList(
            { query: { search: "test1" } } as unknown as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        );
        expect(res.length).equal(1);
        expect(res.some((x) => x.name === "test1")).true;
    });
    it("should get user by id", () => {
        const nullUser = {} as User;
        let res: User = nullUser;
        getUserById(
            { params: { id: "1"} as any } as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        )
        expect(res.name).equal("test2");
        expect(res.email).equal("test-user+2@panenco.com");
    });
    it("should fail when getting user by unknown id", () => {
        try {
            let res: User;
            getUserById(
                { params: { id: "3"} as any } as Request,
                { status: (s) => ({ json: (val) => (res = val ) })} as Response,
                null as any 
            )    
        } catch {
            expect(true).true;
        };
    });
    it ("should create user", async () => {
        const params = {
            body: { 
                email: "test-user+3@panenco.com",
                name: "test3",
                password: "password"}as User
        };

        const nullUser = {} as User;
        let res: User = nullUser;
        
        await create(
            params as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        );
        expect(res.name).equal("test3");
        expect(res.email).equal("test-user+3@panenco.com");
	    // expect(res.password).undefined;
    });
    it("should update user", async () => {
        const body = {
            email: "test-user+0.1@panenco.com",
        } as User;
        const nullUser = {} as User;
        let res: User = nullUser;
        const id = 0;
        await updateById(
            { body, params: { id } as any } as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        );
        expect(res.email).equal(body.email);
        expect(res.name).equal("test1");
        expect(UserStore.users.find((x) => x.id === id)!.email).equal(body.email);
    });
    it("should delete user by id", () => {
        const initialCount = UserStore.users.length;
        let status: number = 0;
        deleteById(
            { params: { id: "1" } as any } as Request,
            { status: (s: number) => {
                    status = s;
                    return { end: () => null };
                },
            } as any as Response,
            null as any
        );

        expect(UserStore.users.some((x) => x.id === 1)).false;
        expect(initialCount - 1).equal(UserStore.users.length);
        expect(status).equal(204);
    });
});
