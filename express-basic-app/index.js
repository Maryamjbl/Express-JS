const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Express JS!");
});

app.get("/about", (req, res) => {
  res.send("This is the About API");
});

app.get("/contact", (req, res) => {
  res.send("Contact us at support@example.com");
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000/");
});