import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { ProductBody } from "../../contracts/product.body";
import { ProductView } from "../../contracts/product.view";
import { create } from "./handlers/create.handler";
import { Serialize } from "../../decorators/serialize.decorator";
import { ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { SearchQuery } from "../../contracts/search.query";
import { getList } from "./handlers/getList.handler";

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
        description: "User created successfully",
        type: ProductView,
    })
    async create(@Body() body: ProductBody): Promise<ProductView> {
        return create(body);
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
    async getList(@Query() query: SearchQuery): Promise<ProductView[]> {
        return await getList(query.search);
    }
}