const express = require("express");
const router = express.Router();

const Invoice = require("../models/invoice");
const Customer = require("../models/Customer");
const Item = require("../models/item");

router.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body;

    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain items" });
    }

    let invoiceItems = [];
    let subTotal = 0;
    let taxTotal = 0;

    for (let line of items) {
      const itemData = await Item.findById(line.item);

      if (!itemData) {
        return res.status(400).json({ message: "Item not found" });
      }

      const amount = line.quantity * itemData.rate;

      const tax = itemData.isTaxable
        ? (amount * itemData.taxPercentage) / 100
        : 0;

      invoiceItems.push({
        item: itemData._id,
        quantity: line.quantity,
        rate: itemData.rate,
        amount,
      });

      subTotal += amount;
      taxTotal += tax;
    }

    const grandTotal = subTotal + taxTotal;

    const invoice = new Invoice({
      customer,
      items: invoiceItems,
      subTotal,
      taxTotal,
      grandTotal,
    });

    const savedInvoice = await invoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
      data: savedInvoice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice" });
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "name email")
      .populate("items.item", "name rate isTaxable taxPercentage")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.item", "name rate isTaxable taxPercentage");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: "Invalid invoice ID" });
  }
});

module.exports = router;