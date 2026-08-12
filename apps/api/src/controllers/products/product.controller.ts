import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductBody } from "../../contracts/product.body";
import { UpdateProductBody } from "../../contracts/update-product.body";
import { ProductView } from "../../contracts/product.view";
import { create } from "./handlers/create.handler";
import { Serialize } from "../../decorators/serialize.decorator";
import { ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { SearchProductsQuery } from "../../contracts/searchProducts.query";
import { getList } from "./handlers/getList.handler";
import { get } from "./handlers/get.handler";
import { update } from "./handlers/update.handler";
import { deleteProduct } from "./handlers/delete.handler";
import { CurrentUser } from "../../decorators/user.decorator";
import { deleteManyProducts } from "./handlers/deleteMany.handler";
import { DeleteManyProductsBody } from "../../contracts/delete-many-products.body";
import { updateManyProducts } from "./handlers/updateMany.handler";
import { UpdateManyProductsBody } from "../../contracts/update-many-products.body";

@Controller("products")
export class ProductController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(ProductView)
    @ApiOperation({ operationId: "createProduct", summary: "Create a new product" })
    @ApiResponse({
        status: 201,
        description: "Product created successfully",
        type: ProductView,
    })
    async create(@Body() body: ProductBody, @CurrentUser("userId") userId: string): Promise<ProductView> {
        return create(userId, body);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(ProductView)
    @ApiOperation({ operationId: "listProducts", summary: "Search all products" })
    @ApiResponse({
        status: 200,
        description: "Product(s) retrieved successfully",
        type: [ProductView],
    })
    async getList(@Query() query: SearchProductsQuery): Promise<ProductView[]> {
        return await getList(query.search, query.fridgeId, query.fridgeLocation, query.ownerId);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(ProductView)
    @ApiOperation({ operationId: "getProduct", summary: "get one product by id" })
    async get(@Param("id") id: string): Promise<ProductView> {
        return get(id);
    }
      
    @Patch("/deleteMany")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ operationId: "deleteMultiple", summary: "Delete all your products, optionally limited to one fridge" })
    async deleteMany(@Body() body: DeleteManyProductsBody, @CurrentUser("userId") userId: string) {
        await deleteManyProducts(body, userId);
    }

    @Patch("/updateMany")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ operationId: "updateMultiple", summary: "Hand all your products to another user, optionally limited to one fridge" })
    async updateMany(@Body() body: UpdateManyProductsBody, @CurrentUser("userId") userId: string) {
        await updateManyProducts(body, userId);
    }
    
    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @Serialize(ProductView)
    @ApiOperation({ operationId: "updateProduct", summary: "Update a product" })
    async update(@Param("id") id: string,  @Body() body: UpdateProductBody, @CurrentUser("userId") userId: string): Promise<ProductView> {
        return update(id, body, userId);
    }
  
    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiSecurity("x-auth")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ operationId: "deleteProduct", summary: "Delete product by id" })
    async delete(@Param("id") id: string, @CurrentUser("userId") userId: string) {
        await deleteProduct(id, userId);
    }

}