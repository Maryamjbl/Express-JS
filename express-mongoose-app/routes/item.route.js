const express = require("express");
const router = express.Router();
const Item = require("../models/item");

router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();

    res.status(201).json({
      message: "Item created successfully",
      data: savedItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch items",
    });
  }
});

module.exports = router;
