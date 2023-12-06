const { con } = require("./reset");
const util = require("util");
const query = util.promisify(con.query).bind(con);

function getItem(item, table) {}

function addTokenToUser(id) {}

async function checkUserToken(user) {
  const id = user.user_id;
  const token = user.token;
  const selectSql = `SELECT * FROM login as l WHERE l.user_id = ? AND l.token = ?; `;
  const result = await query(selectSql, [id, token]);
  return result.length > 0;
}

module.exports = {
  checkUserToken,
};
