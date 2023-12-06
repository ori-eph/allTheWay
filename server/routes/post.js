const express = require("express");
const router = express.Router();
const { checkUserToken } = require("../../db/functions");
const {
  handleCustomPostRequest,
  isTokenValid,
  handleDelete,
  handlePut,
  handleAddItem,
} = require("../router_functions");

router.post("/:postId/comments", async function (req, res) {
  const postId = req.params.postId;
  handleCustomPostRequest(req, res, "comments", { post_id: postId });
});

router.delete("/:id", async function (req, res) {
  handleDelete(req, res, "post");
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "post");
});

router.put("/", async function (req, res) {
  handleAddItem(req, res, "post");
});

router.post("/", async function (req, res) {
  try {
    const user = req.body;
    const userId = req.params.userId;

    if (!user) {
      return res.status(400).send("1");
    }

    const isValidToken = await isTokenValid(user);

    if (!isValidToken) {
      return res.status(400).send("4");
    }

    const response = await getTable("post");
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
