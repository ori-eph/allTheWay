var express = require("express");
const { param } = require(".");
var router = express.Router();
const { checkUserToken, getItem, addTokenToUser, updateItem, getFilteredTable, addItem } = require("../../db/functions");

/* GET users listing. */
router.post("/", async function (req, res, next) {
    const user = req.body;
    if (!user) {
        return res.status(400).send("1");
    }
    if (await checkUserToken({ token: user.token, user_id: user.user_id })) {
        try {
            const response = await getItemTable({
                user_id: user.user_id,
                table: "todo",
            });
            if (response.length === 0) {
                return res.status(404).send("2");
            } else {
                return res.status(200).send(response);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send("3");
        }
    } else {
        return res.status(400).send("4");
    }
});

router.delete("/:id", async function (req, res, next) {
    const item_id = req.params.id;
    const user = req.body;
    const item = await getItem({ item_id: item_id }, "todo");
    try {
        if (await checkUserToken({ token: user.token, user_id: user.user_id })) {
            if (item.user_id === user.user_id) {
                updateItem({ id: item_id, deleted_date });
            } else {
                res.status(400).send();
            }
        } else {
            return res.status(400).send("4");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(3);
    }
});

function getUserTable() {
    return true;
}

function getItemTable(obj) {
    return obj;
}

router.get("/try", (req, res) => {
    getItem('todo', 1);
    addTokenToUser(9);
    updateItem('todo', { title: "hhhhh" }, 1);
    addItem('todo', { user_id: 1, title: "ssss" });
    getFilteredTable('todo', { user_id: 1 });
    res.send();
})

module.exports = router;

// checkToken() return true/false
