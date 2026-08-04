import {expect} from 'chai';
import { beforeEach, describe, it } from "mocha";
import { User, UserStore} from '../../controllers/users/handlers/user.store';
import { getList } from "../../controllers/users/handlers/getList.handler";
import { Request, Response } from 'express';
import { getUserById } from '../../controllers/users/handlers/get.handler';

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
        let res: User;
        getUserById(
            { params: { id: "1"} as any } as Request,
            { json: (val) => (res = val) } as Response,
            null as any
        )
        expect(res.name).equal("test2");
        expect(res.email).equal("test-user+2@panenco.com");
    });
    it("should fail when getting user by unknown id", () => {
        let res: User;
        getUserById(
            { params: { id: "3"} as any } as Request,
            { status: (s) => ({ json: (val) => (res = val ) })} as Response,
            null as any 
        )    
        expect(res.error).equal("User not found");
    });
});
