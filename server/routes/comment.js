const express = require("express");
const router = express.Router();
const {
  handleCustomPostRequest,
  isTokenValid,
  handleDelete,
  handlePut,
  handleAddItem,
  handlePermanentDelete,
} = require("../router_functions");

router.delete("/:id", async function (req, res) {
  handlePermanentDelete(req, res, "comment");
});

router.put("/:id", async function (req, res) {
  handlePut(req, res, "comment");
});

router.post("/", async function (req, res) {
  handleAddItem(req, res, "comment");
});

module.exports = router;
