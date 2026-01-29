require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB error:", err));

const customerRoutes = require("./routes/customer.route");
app.use("/customers", customerRoutes);
app.use("/items", require("./routes/item.route"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});