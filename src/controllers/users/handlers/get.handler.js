const { UserStore } = require("./user.store.js");

const getUserById = (req, res, next) => {
    console.log("hello");
    const user = UserStore.get(req.params.id);
    if (!user) {
        res.status(404).send("error: user not found");
        return;
    }
    res.json(user);
    
};

module.exports = { getUserById };