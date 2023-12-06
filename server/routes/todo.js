var express = require("express");
const { param } = require(".");
var router = express.Router();
const { checkUserToken } = require("../../db/functions");

/* GET users listing. */
<<<<<<< HEAD
router.post("/:id", async function (req, res, next) {
  const id = req.params.id;
  const user = req.body;
  if (await checkUserToken({ token: user.token, user_id: user.user_id })) {
    try {
      const response = await getUserTable({ id: id, table: "todo" });
      if (response.length === 0) {
        return res.status(400).send("1");
      } else {
        return res.status(200).send(response);
      }
    } catch (err) {
      return res.status(400).send("2");
=======
router.post('/', async function (req, res, next) {
    const user = req.body;
    if (await checkUserToken({ token: user.token, user_id: user.user_id })) {
        try {
            const response = await getItemTable({ user_id: user.user_id, table: "todo" });
            if (response.length === 0) {
                return res.status(400).send('1');
            } else {
                return res.status(200).send(response)
            }
        }
        catch (err) {
            return res.status(500).send('3');
        }
    } else {
        return res.status(400).send('4');
>>>>>>> ab5d801fa48921a46010479a62e31b612eb0ebb1
    }
  } else {
    return res.status(500).send("4");
  }
});

<<<<<<< HEAD
=======
router.delete("/:id", async function (req, res, next) {
    const item_id = req.params.id;
    const user = req.body;
    const item = await getItem("todo", item_id);
    try {
        if (await checkUserToken({ token: user.token, user_id: user.user_id })) {
            if (item.user_id === user.user_id) {
                updateItem({ id: item_id, deleted_date })
            } else {
                res.status(400).send()
            }
        } else {
            return res.status(400).send('4');
        }

    } catch (err) {
        return res.status(500).send(3);
    }
})


>>>>>>> ab5d801fa48921a46010479a62e31b612eb0ebb1
function getUserTable() {
  return true;
}

module.exports = router;

// checkToken() return true/false
