const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const validateCustomer = require("../middleware/validateCustomer");

router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();

    res.status(201).json({
      message: "Customer created successfully",
      data: savedCustomer,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const queryString = req.query;

    let filter = {};

    if (queryString.name) {
      filter.name = { $regex: queryString.name, $options: "i" };
    }

    if (queryString.email) {
      filter.email = { $regex: queryString.email, $options: "i" };
    }

    if (queryString.phone) {
      filter.phone = { $regex: queryString.phone, $options: "i" };
    }

    if (queryString.minCredit || queryString.maxCredit) {
      filter.creditLimit = {};
    }

    if (queryString.minCredit) {
      filter.creditLimit.$gte = Number(queryString.minCredit);
    }

    if (queryString.maxCredit) {
      filter.creditLimit.$lte = Number(queryString.maxCredit);
    }

    console.log("QUERY:", req.query);
    console.log("FILTER:", filter);

    const totalInDB = await Customer.countDocuments();
    console.log("TOTAL IN DB:", totalInDB);

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order == "asc" ? 1 : -1;

    const customers = await Customer.find(filter).sort({
      [sortBy]: order,
    });

    res.status(200).json({
      sortOrder: sortBy,
      order: order === 1 ? "asc" : "desc",
      totalCustomers: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid customer ID",
    });
  }
});

module.exports = router;
