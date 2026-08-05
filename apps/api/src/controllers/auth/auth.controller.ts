import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AccessTokenView } from "../../contracts/accessToken.view";
import { LoginBody } from "../../contracts/login.body";
import { createToken } from "./handlers/login.handler";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { serialize } from "v8";

@Controller("auth")
export class AuthController {
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({type: AccessTokenView,})
    @ApiOperation({ operationId: "login", summary: "log in" })
    async login(@Body() body: LoginBody): Promise<AccessTokenView> {
        return createToken(body);
    }
}