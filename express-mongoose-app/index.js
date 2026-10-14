require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));
app.use(helmet());

const limiter = rateLimit({
  windowMs:  60 * 1000,
  max: 50
});
app.use(limiter);

const customerRoutes = require("./routes/customer.route");
app.use("/customers", customerRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const itemRoutes = require("./routes/items.routes");
app.use("/items", itemRoutes);
const invoiceRoutes = require("./routes/invoices.routes");
app.use("/invoices", invoiceRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo error:", err));
