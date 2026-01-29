const validateItem = (req, res, next) => {
  const itemData = req.body;

  if (!itemData.name || itemData.name.trim().length < 2) {
    return res.status(400).json({
      message: "Item name should be at least 2 characters",
    });
  }
  if (
    itemData.rate === undefined ||
    typeof itemData.rate !== "number" ||
    itemData.rate <= 0
  ) {
    return res.status(400).json({
      message: "Rate must be a positive number",
    });
  }

  if (!itemData.unit || itemData.unit.trim().length === 0) {
    return res.status(400).json({
      message: "Unit is required (pcs, kg, box, etc.)",
    });
  }

  if (typeof itemData.isTaxable !== "boolean") {
    return res.status(400).json({
      message: "isTaxable must be true or false",
    });
  }

  if (itemData.isTaxable === true) {
    if (
      itemData.taxPercentage === undefined ||
      typeof itemData.taxPercentage !== "number" ||
      itemData.taxPercentage < 0 ||
      itemData.taxPercentage > 28
    ) {
      return res.status(400).json({
        message: "Tax percentage must be between 0 and 28",
      });
    }
  }

  next();
};

module.exports = validateItem;
