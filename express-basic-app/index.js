const express = require("express");

const app = express();

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000/");
});

app.get("/", (req, res) => {
  res.send("Welcome to Express JS!");
});

app.get("/about", (req, res) => {
  res.send("Request from API endpoint!");
});

app.get("/contact", (req, res) => {
  res.send("Contact us at support@aysha.com");
});

app.get("/users", (request, response) => {
  response.json([
    {
      id: 1,
      name: "Aysha Khan",
    },
    {
      id: 2,
      name: "Fatima Ali",
    },
  ]);
});
