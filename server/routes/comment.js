const express = require("express");
const router = express.Router();
const {
  handleCustomPostRequest,
  isTokenValid,
  handleDelete,
  handlePut,
  handleAddItem,
} = require("../router_functions");

router.delete("/:id", async function (req, res) {
  handleDelete(req, res, "comment");
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "comment");
});

router.put("/", async function (req, res) {
  handleAddItem(req, res, "comment");
});

module.exports = router;
