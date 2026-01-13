const express = require("express");
const router = express.Router();
const validateCustomer = require("../middlewares/validateCustomer");

router.post("/", validateCustomer, (req, res) => {
  res.status(201).json({
    message: "Customer created successfully",
    customer: req.body
  });
});

module.exports = router;