const { UserStore } = require("./user.store.js");

const updateById = (req, res, next) => {
    const user = UserStore.get(req.params.id);
    if (!user) {
        res.status(404).json({error: "user not found"});
        return;
    }
    const updated = UserStore.update(req.params.id, req.body);
    res.json(updated);
};

module.exports = { updateById };