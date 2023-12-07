const express = require("express");
const router = express.Router();
const { checkUserToken } = require("../../db/functions");
const {
  handleDelete,
  handlePut,
  handleCustomPostRequest,
  handleAddItem,
  handlePermanentDelete,
} = require("../router_functions");

router.delete("/:id", async function (req, res) {
  handlePermanentDelete(req, res, "todo");
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "todo");
});

router.post("/", async function (req, res) {
  handleAddItem(req, res, "todo");
});

router.post("/:userId", async function (req, res) {
  const id = req.params.userId;
  handleCustomPostRequest(req, res, "todo", { user_id: id });
});

module.exports = router;
