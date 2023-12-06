var express = require('express');
var router = express.Router();

router.post('/login', async function (req, res, next) {
  const userInfo = req.body;
  if (!userInfo.username && userInfo.password.length < 3) {
    return res.status(400).send('1');
  }
  try {
    const user = await getItem({ username: userInfo.username, password: userInfo.password }, "user");
    if (user.length === 0 || user === false) {
      return res.status(400).send('2');
    }
    const token = await addTokenToUser(user.id);
    return res.status(200).send([{ ...user, token }]);
  }
  catch (err) {
    return res.status(500).send('3');
  }
});

function getItem(obj) {
  return { sgfsdg: "true" };
}
function addTokenToUser(obj) {
  return "true";
}


module.exports = router;
// checkIfUserExist() return array with the user info
// addTokenToUser() return 