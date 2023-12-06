var express = require("express");
const { param } = require(".");
var router = express.Router();
const { checkUserToken } = require("../../db/functions");

/* GET users listing. */
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
    }
  } else {
    return res.status(500).send("4");
  }
});

function getUserTable() {
  return true;
}

module.exports = router;

// checkToken() return true/false
