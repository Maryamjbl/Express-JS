const express = require("express");
const router = express.Router();

let items = [];

router.get("/", (req, res) => {
  res.json(items);
});

// get
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (!item) {
    res.statusCode = 404;
    res.json({
      message: "Item not found!",
    });
  } else {
    res.statusCode = 200;
    res.json(item);
  }
});

// post
router.post("/", (req, res) => {
  const itemData = req.body;

  if (!itemData.name || itemData.name.trim().length < 3) {
    return res
      .status(400)
      .json({ message: "Item name must be at least 3 characters" });
  }
  if (
    itemData.price === undefined ||
    typeof itemData.price !== "number" ||
    itemData.price <= 0
  ) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  itemData.id = items.length + 1;
  items.push(itemData);

  res.status(201).json({
    message: "Item created successfully",
    item: itemData,
  });
});

// put
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found!" });
  }

  const { name, price } = req.body;
  if (name) item.name = name;
  if (price) item.price = price;

  res.json({
    message: "Item updated successfully",
    item,
  });
});

// delete
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemObj = items.find((item) => item.id === id);

  if (!itemObj) {
    res.statusCode = 404;
    res.json({ message: "Item not found!" });
  } else {
    const index = items.indexOf(itemObj);
    items.splice(index, 1);
    res.json({ message: "Item deleted successfully" });
  }
});

module.exports = router;
