const express = require("express");
const app = express();

app.use(express.json());
let users = [];

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userObj = users.find((user) => user.id === id);
  if (!userObj) {
    res.statusCode = 404;
    res.json({
      message: "User not found!",
    });
  } else {
    res.statusCode = 200;
    res.json(userObj);
  }
});

app.post("/users", (req, res) => {
  let userData = req.body; 
  let validator = require("validator");
  if (!userData.name || userData.name.trim().length <= 3) {
    return res.status(400).json({
      message: "Name should be at least 3 characters",
    });
  }
   if (!userData.email || !validator.isEmail(userData.email)) {
    return res.status(400).json({
      message: "Email cannot be blank and should be in correct format",
    });
  }

    const phone = userData.phone;
  if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
    return res.status(400).json({
      message: "Phone number should be correct",
    });
  }
  const age = userData.age;
  if (age === undefined || !Number.isInteger(age) || age < 18 || age > 100) {
    return res.status(400).json({
      message: "Age should be between 18 and 100",
    });
  }

    userData.id = users.length + 1; 
  users.push(userData); 
  res.status(201).json({
    message: "User created successfully",
    user: userData,
  });
});

app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userObj = users.find((user) => user.id === id);
  if (!userObj) {
    res.statusCode = 404;
    res.json({
      message: "User not found!",
    });
  } else {
    const index = users.indexOf(userObj); 
    users.splice(index, 1);
    res.json({
      message: "User deleted successfully",
    });
  }
});
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const userObj = users.find((user) => user.id === id);
  if (!userObj) {
    return res.status(404).json({
      message: "User not found!",
    });
  }
  const userRequest = req.body;
  userObj.email = userRequest.email;
  userObj.name = userRequest.name;
  
  res.json({
    message: "User updated successfully",
    user: userObj,
  });
});
