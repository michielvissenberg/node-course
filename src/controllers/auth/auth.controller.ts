import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AccessTokenView } from "../../contracts/accessToken.view";
import { LoginBody } from "../../contracts/login.body";
import { createToken } from "./handlers/login.handler";

@Controller("auth")
export class AuthController {
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginBody): Promise<AccessTokenView> {
        return createToken(body);
    }
}