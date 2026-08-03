const { Router } = require("express");
const { getList } = require("./handlers/getList.handler.js");

class UserRoute {
    constructor() {
        this.router = Router();
        this.path = "users";

        this.router.get("/", getList);
    } 
}

module.exports = { UserRoute };
