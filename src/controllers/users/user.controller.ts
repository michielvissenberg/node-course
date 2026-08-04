import { create } from "./handlers/create.handler";
import { get } from "./handlers/get.handler";
import { getList } from "./handlers/getList.handler";
import { update } from "./handlers/update.handler";
import { deleteUser } from "./handlers/delete.handler";

import { Body, Controller, Post, Get, Patch, Delete, Query, Param, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity} from "@nestjs/swagger";

import { UserBody } from "../../contracts/user.body";
import { SearchQuery } from "../../contracts/search.query";
import { Serialize } from "../../decorators/serialize.decorator";
import { UserView } from "../../contracts/user.view";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";

@Controller("users")
export class UserController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Serialize(UserView)
	@ApiOperation({ summary: "Create a new user" })
	@ApiResponse({
		status: 201,
		description: "User created successfully",
		type: UserView,
	})
	async create(@Body() body: UserBody): Promise<UserView> {
		return create(body);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@Serialize(UserView)
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({
		status: 200,
		description: "Users retrieved successfully",
		type: [UserView],
	})
	async getList(@Query() query: SearchQuery): Promise<UserView[]> {
		return getList(query.search);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	@Serialize(UserView)
	async get(@Param("id") id: string): Promise<UserView> {
		return get(id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard)
	@Serialize(UserView)
	async update(@Param("id") id: string, @Body() body: UserBody): Promise<UserView> {
		return update(id, body);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param("id") id: string) {
		await deleteUser(id);
	}
}