const { con } = require("./reset");
const util = require("util");
const query = util.promisify(con.query).bind(con);

async function getItem(table, id) {
  let sql = `SELECT * FROM ${table} WHERE ${table}.id = ${id}`;
  const result = await query(sql)
  return result;
}


async function addTokenToUser(id) {
  let num = Math.floor(Math.random() * 100);
  console.log('num --->', num);
  let sql = `INSERT INTO login (user_id, token) VALUES (${id}, '${JSON.stringify(num) + id}');`;
  console.log('sql --->', sql);
  const result = await query(sql);
  return result;
}

async function checkUserToken(user) {
  const id = user.user_id;
  const token = user.token;
  const selectSql = `SELECT * FROM login as l WHERE l.user_id = ? AND l.token = ?; `;
  const result = await query(selectSql, [id, token]);
  return result.length > 0;
}

async function updateItem(table, values, id) {
  let sql = `UPDATE ${table} SET `;
  for (const key in values) {
    sql += `${key} = '${values[key]}' ,`;
  }
  sql = sql.slice(0, -1);
  sql += `WHERE id = ${id};`;
  console.log('sql --->', sql);
  const result = await query(sql);
  return result;
}

async function addItem(table, values) {
  let sql = `INSERT INTO ${table} (`;
  for (const key in values) {
    sql += `${key}, `
  }
  sql = sql.slice(0, -2) + ") VALUES (";
  for (const key in values) {
    sql += `'${values[key]}', `
  }
  sql = sql.slice(0, -2) + ");"
  console.log('sql --->', sql);
  const result = await query(sql);
  return result;
}

async function getFilteredTable(table, values) {
  let sql = `SELECT * FROM ${table} WHERE `;
  for (const key in values) {
    sql += `${table}.${key} = ${values[key]} AND `
  }
  sql = sql.slice(0, -4) + ";";
  console.log('sql --->', sql);
  const result = await query(sql)
  return result;
}

// getFilteredTable
module.exports = {
  checkUserToken,
  getItem,
  addTokenToUser,
  updateItem,
  addItem,
  getFilteredTable
};
