const {
  getFilteredTable,
  getItem,
  updateItem,
  checkUserToken,
  addItem,
  deleteItem,
} = require("../db/functions");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

async function handleCustomPostRequest(req, res, table, filter) {
  try {
    const user = req.body;

    if (!user) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    const response = await getFilteredTable(table, filter);
    if (response.length === 0) {
      return res.status(404).send("2");
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error("Error occurred in POST route:", error);
    return res.status(500).send("3");
  }
}

async function handleDelete(req, res, table) {
  try {
    const itemId = req.params.id;
    const user = req.body;

    const item = await getItem(table, itemId);

    if (!user) {
      return res.status(400).send("4");
    }

    if (Object.keys(item).length === 0) {
      return res.status(400).send("2");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    if (item.user_id != user.user_id) {
      return res.status(400).send("5");
    }

    const deletedItem = await updateItem(
      table,
      {
        deleted_date: formatDate(new Date()),
      },
      itemId
    );
    return res.status(200).send(deletedItem);
  } catch (error) {
    console.error("Error occurred in DELETE route:", error);
    return res.status(500).send("3");
  }
}

async function handlePermanentDelete(req, res, table) {
  try {
    const itemId = req.params.id;
    const user = req.body;

    const item = await getItem(table, itemId);

    if (!user) {
      return res.status(400).send("4");
    }

    if (Object.keys(item).length === 0) {
      return res.status(400).send("2");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    if (item.user_id != user.user_id) {
      return res.status(400).send("5");
    }

    const deletedItem = await deleteItem(table, itemId);
    if (!Object.keys(deletedItem).length) {
      return res.status(400).send(2);
    }

    return res.status(200).send(deletedItem);
  } catch (error) {
    console.error("Error occurred in DELETE route:", error);
    return res.status(500).send("3");
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function handlePut(req, res, table) {
  try {
    const itemId = req.params.id;
    const user = req.body.user;
    const updatedValues = req.body.item;

    const item = await getItem(table, itemId);
    console.log(item);

    if (!user) {
      return res.status(400).send("4");
    }
    if (Object.keys(item).length === 0) {
      return res.status(400).send("2");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }
    if (item.user_id != user.user_id) {
      return res.status(400).send("5");
    }

    const updatedItem = await updateItem(table, updatedValues, itemId);
    return res.status(200).send(updatedItem);
  } catch (error) {
    console.error("Error occurred in PUT route:", error);
    return res.status(500).send("3");
  }
}

async function handleRestore(req, res, table) {
  try {
    const itemId = req.params.id;
    const user = req.body;

    const item = await getItem(table, itemId);
    console.log(item);

    if (!user) {
      return res.status(400).send("4");
    }
    if (Object.keys(item).length === 0) {
      return res.status(400).send("2");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }
    if (item.user_id != user.user_id) {
      return res.status(400).send("5");
    }

    const updatedItem = await updateItem(table, { deleted_date: null }, itemId);
    return res.status(200).send(updatedItem);
  } catch (error) {
    console.error("Error occurred in RESTORE route:", error);
    return res.status(500).send("3");
  }
}

async function handleAddItem(req, res, table) {
  try {
    const user = req.body.user;
    const newItem = req.body.item;

    if (!user) {
      console.log("???");
      return res.status(400).send("4");
    }
    if (!newItem) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      console.log("not valid???");
      return res.status(400).send("4");
    }

    if (!validateNewItem(table, newItem)) {
      return res.status(400).send("1");
    }

    const createdItem = await addItem(table, newItem);
    return res.status(200).send(createdItem);
  } catch (error) {
    console.error("Error occurred in PUT route:", error);
    return res.status(500).send("3");
  }
}

async function isTokenValid(user) {
  try {
    const isTokenValid = await checkUserToken({
      token: user.token,
      user_id: user.user_id,
    });

    return isTokenValid;
  } catch (error) {
    return false;
  }
}

async function validateNewItem(table, item) {
  const entityData = await fsPromises.readFile(
    path.join("../", "db", "entities", `${table}.json`)
  );
  const { id, deleted_date, foreign_keys, ...fields } = JSON.parse(entityData);

  const itemFields = Object.keys(item);
  const requiredFields = Object.keys(fields);

  for (const field of requiredFields) {
    if (!itemFields.includes(field)) {
      return false;
    }
  }

  return true;
}

module.exports = {
  handleDelete,
  handleCustomPostRequest,
  handlePut,
  handleAddItem,
  isTokenValid,
  handleRestore,
  handlePermanentDelete,
};
