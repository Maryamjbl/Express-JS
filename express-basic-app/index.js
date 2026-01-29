const express = require("express");
const app = express();

app.use(express.json());
const userRoutes = require("./routes/user.route");
const itemRoutes = require("./routes/item.route");

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});