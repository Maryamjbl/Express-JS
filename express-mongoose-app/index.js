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
  max: 0
});
app.use(limiter);

const customerRoutes = require("./routes/customer.route");
app.use("/customers", customerRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo error:", err));
