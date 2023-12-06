var express = require("express");
const { handleCustomPostRequest } = require("../router_functions");
const { addTokenToUser, getItem, getUser } = require("../../db/functions");
var router = express.Router();

router.post("/login", async function (req, res, next) {
  const userInfo = req.body;
  if (!userInfo.username && userInfo.password.length < 3) {
    return res.status(400).send("1");
  }
  try {
    const user = await getUser({
      username: userInfo.username,
      password: userInfo.password,
    });
    if (Object.keys(user).length === 0) {
      return res.status(400).send("2");
    }
    console.log(user);
    const token = await addTokenToUser(user.id);
    return res.status(200).send([{ ...user, token }]);
  } catch (err) {
    console.log(err);
    return res.status(500).send("3");
  }
});

router.post("/:userId/todo", async function (req, res) {
  const userId = req.params.userId;
  handleCustomPostRequest(req, res, "todo", { user_id: userId });
});

module.exports = router;
