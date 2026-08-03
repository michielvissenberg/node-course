const { UserStore } = require("./user.store.js");

const deleteById = (req, res, next) => {
    const user = UserStore.get(req.params.id);

    if (!user) {
        return res.status(400).json( {error: "user not found"});
    }

    UserStore.delete(req.query.id);
    res.status(204).json(`user ${req.query.id} deleted`);
};

module.exports = { deleteById };