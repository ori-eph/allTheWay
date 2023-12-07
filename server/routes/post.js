const express = require("express");
const router = express.Router();
const { checkUserToken, getPage, getItem } = require("../../db/functions");
const {
  handleCustomPostRequest,
  isTokenValid,
  handleDelete,
  handlePut,
  handleAddItem,
  handleRestore,
} = require("../router_functions");

router.post("/:postId/comment", async function (req, res) {
  const postId = req.params.postId;
  handleCustomPostRequest(req, res, "comment", {
    post_id: postId,
    deleted_date: null,
  });
});

router.post("/add", async function (req, res) {
  handleAddItem(req, res, "post");
});

router.delete("/:id", async function (req, res) {
  handleDelete(req, res, "post");
});

router.post("/:id", async function (req, res) {
  const postId = req.params.id;
  try {
    const user = req.body;

    if (!user) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    const response = await getItem("post", postId);
    if (response.length === 0) {
      return res.status(404).send("2");
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error("Error occurred in POST route:", error);
    return res.status(500).send("3");
  }
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "post");
});

router.post("/:id/restore", async function (req, res) {
  handleRestore(req, res, "post");
});

router.post("/", async function (req, res) {
  try {
    const user = req.body;
    const userId = req.params.userId;

    if (!user) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);
    console.log(user, isTokenValid(user));

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    const query = req.query;
    const response = await getPage("post", query);

    if (response.length === 0) {
      return res.status(404).send("2");
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error("Error occurred in POST route:", error);
    return res.status(500).send("3");
  }
});

module.exports = router;
