const express = require("express");
const validator = require("validator");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const Customer = require("../models/Customer");

const limiter = rateLimit({
  windowMs:   3 *60 * 1000,
  max: 50
});

const validateCustomer = (req, res, next) => {
  let userData = req.body;

  if (!userData.name || userData.name.trim().length < 3) {
    return res.status(400).json({
      message: "Name should be at least 3 characters",
    });
  }

  if (!userData.email || !validator.isEmail(userData.email)) {
    return res.status(400).json({
      message: "Email cannot be blank and should be in correct format",
    });
  }

  const phone = userData.phone?.toString();
  if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
    return res.status(400).json({
      message: "Phone number should be correct",
    });
  }

  const creditLimit = Number(userData.creditLimit);
  if (isNaN(creditLimit) || creditLimit < 0 || creditLimit > 100000) {
    return res.status(400).json({
      message: "Credit Limit should be between 0 and 1,00,000",
    });
  }

  const email = 

  userData.name = userData.name.trim();
  userData.email = userData.email.toLowerCase();
  userData.phone = phone;
  userData.creditLimit = creditLimit;

  next();
};

router.post("/", limiter,validateCustomer, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const queryString = req.query;
    let filter = {}; 

    if (queryString.name) {
      filter.name = { $regex: queryString.name, $options: "i" };
    }

    if (queryString.email) {
      filter.email = { $regex: queryString.email, $options: "i" };
    }

    const page = parseInt(queryString.page) || 1;
    const limit = parseInt(queryString.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = queryString.sortBy || "createdAt";
    const order = queryString.order === "asc" ? 1 : -1;

    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order });

    res.status(200).json({
      page,
      limit,
      totalCustomers: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Customer ID" });
  }

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.status(200).json(customer);
});


router.put("/:id", authMiddleware, validateCustomer, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Customer ID" });
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.status(200).json({
    message: "Customer updated successfully",
    data: updatedCustomer,
  });
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

  if (!deletedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.status(200).json({ message: "Customer deleted successfully" });
});

module.exports = router;
