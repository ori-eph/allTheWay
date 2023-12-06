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

    const response = await getFilteredTable(filter, table);
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

    const deletedItem = await updateItem(table, itemId, {
      deleted_date: new Date(),
    });
    return res.status(200).send(deletedItem);
  } catch (error) {
    console.error("Error occurred in DELETE route:", error);
    return res.status(500).send("3");
  }
}

async function handlePut(req, res, table) {
  try {
    const itemId = req.params.id;
    const user = req.body.user;
    const updatedValues = req.body.item;

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

    const updatedItem = await updateItem(table, itemId, updatedValues);
    return res.status(200).send(updatedItem);
  } catch (error) {
    console.error("Error occurred in PUT route:", error);
    return res.status(500).send("3");
  }
}

async function handleAddItem(req, res, table) {
  try {
    const user = req.body.user;
    const newItem = req.body.item;

    if (!user) {
      return res.status(400).send("4");
    }
    if (!newItem) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    if (!validateNewItem(newItem)) {
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

function validateNewItem(item, table) {
  const entityData = fs.readFileSync(
    path.join(__dirname, "db", "entities", `${table}.json`)
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
};
