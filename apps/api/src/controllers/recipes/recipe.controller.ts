import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Serialize } from "../../decorators/serialize.decorator";
import { ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { SearchQuery } from "../../contracts/search.query";
import { RecipeBody } from "../../contracts/recipe.body";
import { UpdateRecipeBody } from "../../contracts/update-recipe.body";
import { RecipeView } from "../../contracts/recipe.view";
import { create } from "./handlers/create.handler";
import { getList } from "./handlers/getList.handler";
import { get } from "./handlers/get.handler";
import { update } from "./handlers/update.handler";
import { deleteRecipe } from "./handlers/delete.handler";
import { CurrentUser } from "../../decorators/user.decorator";
import { getAiRecipe } from "./handlers/aiRecipe.handler";
import { AiResponseBody } from "../../contracts/aiResponse.body";
 

@Controller("recipes")
export class RecipeController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(RecipeView)
    @ApiOperation({ operationId: "createRecipe", summary: "Create a new recipe" })
    @ApiResponse({
        status: 201,
        description: "Recipe created successfully",
        type: RecipeView,
    })
    async create(@Body() body: RecipeBody, @CurrentUser("userId") userId: string): Promise<RecipeView> {
        return create(body, userId);
    }

    @Get("/aiRecipe")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(AiResponseBody)
    @ApiOperation({ operationId: "getAiRecipe", summary: "get an ai-generated recipe based on your products" })
    @ApiResponse({
        status: 200,
        description: "Recipes created successfully",
        type: AiResponseBody,
    })
    async getAiRecipe(@CurrentUser("userId") userId: string): Promise<AiResponseBody> {
        return await getAiRecipe(userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(RecipeView)
    @ApiOperation({ operationId: "listRecipes", summary: "Search all recipes" })
    @ApiResponse({
        status: 200,
        description: "Recipes(s) retrieved successfully",
        type: [RecipeView],
    })
    async getList(@Query() query: SearchQuery): Promise<RecipeView[]> {
        return await getList(query.search);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(RecipeView)
    @ApiOperation({ operationId: "getRecipe", summary: "get one recipe by id" })
    async get(@Param("id") id: string): Promise<RecipeView> {
        return get(id);
    }
  
    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(RecipeView)
    @ApiOperation({ operationId: "updateRecipe", summary: "Update a recipe" })
    async update(@Param("id") id: string, @Body() body: UpdateRecipeBody, @CurrentUser("userId") userId: string): Promise<RecipeView> {
        return update(id, body, userId);
    }
  
    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ operationId: "deleteRecipe", summary: "Delete recipe by id" })
    async delete(@Param("id") id: string, @CurrentUser("userId") userId: string) {
        await deleteRecipe(id, userId);
    }
}