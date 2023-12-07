const { con } = require("./reset");
const util = require("util");
const query = util.promisify(con.query).bind(con);

async function getItem(table, id) {
  let sql = `SELECT ${table}.*, user.username, user.email 
             FROM ${table} 
             LEFT JOIN user ON ${table}.user_id = user.id 
             WHERE ${table}.id = ${id};`;

  const result = await query(sql);
  if (result.length) {
    return result[0];
  } else {
    return {};
  }
}

async function getUser(user) {
  let sql = `SELECT * FROM user as u JOIN user_pass as p ON p.user_id = u.id WHERE u.username = ? AND p.password = ?;`;
  console.log(user);
  const result = await query(sql, [user.username, user.password]);
  if (result.length) {
    return result[0];
  } else {
    return {};
  }
}

async function addTokenToUser(id) {
  console.log(id);
  let num = Math.floor(Math.random() * 10000);
  console.log("num --->", num);
  let sql = `INSERT INTO login (user_id, token) VALUES (${id}, '${num}');`;
  console.log("sql --->", sql);
  const result = await query(sql);
  return num;
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
    if (values[key] === null) {
      sql += `${key} = NULL, `;
    } else {
      sql += `${key} = '${values[key]}' , `;
    }
  }
  sql = sql.slice(0, -2);
  sql += ` WHERE id = ${id};`;
  console.log("sql --->", sql);
  await query(sql);
  let select = `SELECT * FROM ${table} WHERE ${table}.id = ${id};`;
  const result = await query(select);
  return result.length ? result[0] : {};
}

async function addItem(table, values) {
  let sql = `INSERT INTO ${table} (`;
  for (const key in values) {
    sql += `${key}, `;
  }
  sql = sql.slice(0, -2) + ") VALUES (";
  for (const key in values) {
    sql += `'${values[key]}', `;
  }
  sql = sql.slice(0, -2) + ");";
  console.log("sql --->", sql);
  const addQuery = await query(sql);
  const id = addQuery.insertId;
  let selectSql = `SELECT * FROM ${table} WHERE id = ? `;
  const result = await query(selectSql, [id]);
  return result[0];
}

async function getFilteredTable(table, values) {
  let sql = `SELECT * FROM ${table} as t WHERE `;
  for (const key in values) {
    if (key === "deleted_date") {
      if (values[key] === null) {
        sql += `${table}.${key} IS NULL AND `;
      } else {
        sql += `t.${key} IS NOT NULL AND `;
      }
    } else {
      sql += `t.${key} = ${values[key]} AND `;
    }
  }
  sql = sql.slice(0, -4) + ";";
  console.log("sql --->", sql);
  const result = await query(sql);
  return result;
}

async function getCount(table) {
  let sql = `SELECT COUNT(*) as count FROM ${table}`;
  console.log("sql --->", sql);
  const result = await query(sql);
  return result[0].count;
}

async function getPage(table, queryParams) {
  const page = queryParams._page || 1;
  const limit = queryParams._limit || 10;

  delete queryParams._page;
  delete queryParams._limit;

  let sql = `SELECT ${table}.*, user.username 
             FROM ${table} 
             LEFT JOIN user ON ${table}.user_id = user.id 
             WHERE `;

  for (const key in queryParams) {
    sql += `${table}.${key} = ${queryParams[key]} AND `;
  }

  const offset = (page - 1) * limit;
  sql += `${table}.deleted_date IS NULL LIMIT ${limit} OFFSET ${offset};`;

  console.log("sql --->", sql);
  const result = await query(sql);
  return result;
}

async function deleteItem(table, id) {
  let select = `SELECT * FROM ${table} WHERE ${table}.id = ${id};`;
  const resultBeforeDeletion = await query(select);

  let sql = `DELETE FROM ${table} WHERE id = ${id};`;
  console.log("sql --->", sql);
  await query(sql);

  if (resultBeforeDeletion.length) {
    const deletedObject = {
      ...resultBeforeDeletion[0],
      deleted: true,
      deleted_date: new Date(),
    };
    return deletedObject;
  } else {
    return {};
  }
}

module.exports = {
  checkUserToken,
  getItem,
  addTokenToUser,
  updateItem,
  addItem,
  getFilteredTable,
  getUser,
  getPage,
  deleteItem,
  getCount,
};
