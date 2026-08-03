const { Router } = require("express");
const { getList } = require("./handlers/getList.handler.js");
const { create } = require("./handlers/create.handler.js");
const { getUserById } = require("./handlers/get.handler.js");
const { updateById } = require("./handlers/update.handler.js");
const { deleteById } = require("./handlers/delete.handler.js");

const adminMiddleware = (req, res, next) => {
	if (req.header("auth") !== "api-key") {
		return res.status(401).send("Unauthorized");
	}
	next();
};

class UserRoute {
    constructor() {
        this.router = Router();
        this.path = "users";

        this.router.get("/", getList);
        this.router.get("/:id", getUserById);
        this.router.patch("/:id", updateById);
        this.router.delete("/:id", deleteById);
        this.router.post("/", adminMiddleware, create);
    } 
}

module.exports = { UserRoute };
