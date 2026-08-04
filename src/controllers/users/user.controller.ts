import { create } from "./handlers/create.handler";
import { get } from "./handlers/get.handler";
import { getList } from "./handlers/getList.handler";
import { update } from "./handlers/update.handler";
import { deleteUser } from "./handlers/delete.handler";

import { Body, Controller, Post, Get, Patch, Delete, Query, Param, HttpCode, HttpStatus } from "@nestjs/common";

import { UserBody } from "../../contracts/user.body";
import { SearchQuery } from "../../contracts/search.query";
import { Serialize } from "../../decorators/serialize.decorator";
import { UserView } from "../../contracts/user.view";

@Controller("users")
export class UserController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Serialize(UserView)
	async create(@Body() body: UserBody): Promise<UserView> {
		return create(body);
	}

	@Get()
	@Serialize(UserView)
	async getList(@Query() query: SearchQuery): Promise<UserView[]> {
		return getList(query.search);
	}

	@Get(":id")
	@Serialize(UserView)
	async get(@Param("id") id: string): Promise<UserView> {
		return get(id);
	}

	@Patch(":id")
	@Serialize(UserView)
	async update(@Param("id") id: string, @Body() body: UserBody): Promise<UserView> {
		return update(id, body);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param("id") id: string) {
		await deleteUser(id);
	}
}