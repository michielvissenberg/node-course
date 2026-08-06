import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Serialize } from "../../decorators/serialize.decorator";
import { ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { SearchQuery } from "../../contracts/search.query";
import { FridgeView } from "../../contracts/fridge.view";
import { FridgeBody } from "../../contracts/fridge.body";
import { create } from "./handlers/create.handler";
import { getList } from "./handlers/getList.handler";
import { get } from "./handlers/get.handler";
import { update } from "./handlers/update.handler";
import { deleteFridge } from "./handlers/delete.handler";

@Controller("fridges")
export class FridgeController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(FridgeView)
    @ApiOperation({ operationId: "createFridge", summary: "Create a new fridge" })
    @ApiResponse({
        status: 201,
        description: "Fridge created successfully",
        type: FridgeView,
    })
    async create(@Body() body: FridgeBody): Promise<FridgeView> {
        return create(body);
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(FridgeView)
    @ApiOperation({ operationId: "listFridges", summary: "Search all fridges" })
    @ApiResponse({
        status: 200,
        description: "Fridges(s) retrieved successfully",
        type: [FridgeView],
    })
    async getList(@Query() query: SearchQuery): Promise<FridgeView[]> {
        return await getList(query.search);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(FridgeView)
    @ApiOperation({ operationId: "getFridge", summary: "get one fridge by id" })
    async get(@Param("id") id: string): Promise<FridgeView> {
        return get(id);
    }
  
    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(FridgeView)
    @ApiOperation({ operationId: "updateFridge", summary: "Update a fridge" })
    async update(@Param("id") id: string, @Body() body: FridgeBody): Promise<FridgeView> {
        return update(id, body);
    }
  
    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ operationId: "deleteFridge", summary: "Delete fridge by id" })
    async delete(@Param("id") id: string) {
        await deleteFridge(id);
    }
}