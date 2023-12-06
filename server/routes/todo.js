const express = require("express");
const router = express.Router();
const { checkUserToken } = require("../../db/functions");
const {
  handleDelete,
  handlePut,
  handlePost,
  handleCustomPostRequest,
  handleAddItem,
} = require("../router_functions");

router.delete("/:id", async function (req, res) {
  handleDelete(req, res, "todo");
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "todo");
});

router.put("/", async function (req, res) {
  handleAddItem(req, res, "todo");
});

router.post("/:userId", async function (req, res) {
  const id = req.params.userId;
  req.handleCustomPostRequest(req, res, "todo", { user_id: id });
});

module.exports = router;
