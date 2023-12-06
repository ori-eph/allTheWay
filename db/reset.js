const mysql = require("mysql");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "allTheWay",
});

const resetDatabase = async () => {
  try {
    // Drop and recreate the database 'allTheWay'
    con.query("DROP DATABASE IF EXISTS allTheWay");
    con.query("CREATE DATABASE allTheWay");

    console.log('Database "allTheWay" reset successfully.');
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    con.end();
  }
};

const createTablesFromEntities = async () => {
  const entitiesFolderPath = path.join(__dirname, "entities");

  const tableCreationOrder = [
    "user.json",
    "user_pass.json",
    "album.json",
    "photo.json",
    "post.json",
    "comment.json",
    "todo.json",
    "login.json",
  ];

  try {
    con.query("CREATE DATABASE IF NOT EXISTS allTheWay");
    con.query("USE allTheWay");

    for (const file of tableCreationOrder) {
      const filePath = path.join(entitiesFolderPath, file);
      const entityData = await fsPromises.readFile(filePath, "utf8");
      const entity = JSON.parse(entityData);

      let createTableQuery = `CREATE TABLE IF NOT EXISTS ${
        path.parse(file).name
      } (`;

      for (const key in entity) {
        if (key !== "foreign_keys") {
          createTableQuery += `${key} ${entity[key]}, `;
        }
      }

      if (entity.foreign_keys && entity.foreign_keys.length > 0) {
        for (const foreignKey of entity.foreign_keys) {
          createTableQuery += `FOREIGN KEY (${foreignKey.key}) REFERENCES ${foreignKey.ref} ON DELETE CASCADE, `;
        }
      }

      createTableQuery = createTableQuery.slice(0, -2) + ");";

      try {
        con.query(createTableQuery, (err, result) => {
          if (err) {
            throw new Error(`Error creating table ${file}: ${err}`);
          } else {
            console.log(`Table ${file} created successfully.`);
          }
        });
      } catch (error) {
        throw new Error(`Error creating table ${file}: ${error}`);
      }
    }

    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    con.end();
  }
};

const fillTables = async () => {
  try {
    await insertUsers();
    await insertAlbums();
    await insertPhotos();
    await insertPosts();
    await insertComments();
    await insertTodos();
    console.log("Data inserted into tables successfully.");
  } catch (error) {
    console.error("Error filling tables:", error);
  } finally {
    con.end();
  }
};

const insertUsers = async () => {
  const usersResponse = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  const users = await usersResponse.json();

  for (const user of users) {
    const insertUserQuery = `INSERT INTO user (id, username, email, deleted_date) VALUES (?, ?, ?, ?)`;
    const userValues = [user.id, user.username, user.email, null];
    try {
      await queryDatabase(insertUserQuery, userValues);
      await insertUserPass(user.id, user.website);
      //  console.log(`User inserted with ID: ${user.id}`);
    } catch (error) {
      throw new Error(`Error inserting user data: ${error}`);
    }
  }
};

const insertUserPass = async (userId, password) => {
  const insertQuery = `INSERT INTO user_pass (user_id, password) VALUES (?, ?)`;
  const values = [userId, password];

  try {
    await queryDatabase(insertQuery, values);
    // console.log(`User password inserted for user ID: ${userId}`);
  } catch (error) {
    throw new Error(`Error inserting user_pass data: ${error}`);
  }
};

const insertPhotos = async () => {
  const photosResponse = await fetch(
    "https://jsonplaceholder.typicode.com/photos"
  );
  const photos = await photosResponse.json();

  for (const photo of photos) {
    const insertQuery = `INSERT INTO photo (id, title, url, album_id, deleted_date) VALUES (?, ?, ?, ?, ?)`;
    const values = [photo.id, photo.title, photo.url, photo.albumId, null];

    try {
      await queryDatabase(insertQuery, values);
    } catch (error) {
      throw new Error(`Error inserting photo data: ${error}`);
    }
  }
};

// Function to insert albums data
const insertAlbums = async () => {
  const albumsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/albums"
  );
  const albums = await albumsResponse.json();

  for (const album of albums) {
    const insertQuery = `INSERT INTO album (id, title, user_id) VALUES (?, ?, ?)`;
    const values = [album.id, album.title, album.userId];

    try {
      await queryDatabase(insertQuery, values);
    } catch (error) {
      throw new Error(`Error inserting album data: ${error}`);
    }
  }
};

// Function to insert comments data
const insertComments = async () => {
  const commentsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  );
  const comments = await commentsResponse.json();

  for (const comment of comments) {
    const insertQuery = `INSERT INTO comment (id, title, body, post_id, user_id, deleted_date) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      comment.id,
      comment.name,
      comment.body,
      comment.postId,
      Math.floor(Math.random() * 10) + 1,
      null,
    ];

    try {
      await queryDatabase(insertQuery, values);
    } catch (error) {
      throw new Error(`Error inserting comment data: ${error}`);
    }
  }
};

// Function to insert todos data
const insertTodos = async () => {
  const todosResponse = await fetch(
    "https://jsonplaceholder.typicode.com/todos"
  );
  const todos = await todosResponse.json();

  for (const todo of todos) {
    const insertQuery = `INSERT INTO todo (id, title, completed, user_id, deleted_date) VALUES (?, ?, ?, ?, ?)`;
    const values = [todo.id, todo.title, todo.completed, todo.userId, null];

    try {
      await queryDatabase(insertQuery, values);
    } catch (error) {
      throw new Error(`Error inserting todo data: ${error}`);
    }
  }
};

// Function to insert posts data
const insertPosts = async () => {
  const postsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  );
  const posts = await postsResponse.json();

  for (const post of posts) {
    const insertQuery = `INSERT INTO post (id, title, body, user_id, deleted_date) VALUES (?, ?, ?, ?, ?)`;
    const values = [post.id, post.title, post.body, post.userId, null];

    try {
      await queryDatabase(insertQuery, values);
    } catch (error) {
      throw new Error(`Error inserting post data: ${error}`);
    }
  }
};

async function queryDatabase(query, values) {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error}`);
  }
}

// resetDatabase();
// createTablesFromEntities();
// fillTables();

module.exports = {
  mysql,
  con,
};
