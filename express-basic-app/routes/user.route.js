const express = require("express");
const validateCustomer = require("../middlewares/validateCustomer");
const router = express.Router();

let users = [];

router.get("/", (req, res) => {
  res.json(users);
});

// get
router.get("/:id", (req, res) => {
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

// delete
router.delete("/:id", (req, res) => {
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

// post
router.post("/", validateCustomer, (req, res) => {
  const userData = req.body;
  userData.id = users.length + 1; 
  res.status(201).json({
    message: "User created successfully",
    user: userData,
  });
});

// put 
router.put("/:id", validateCustomer, (req, res) => {
  const id = parseInt(req.params.id);
  const userObj = users.find((user) => user.id === id);
  if (!userObj) {
    return res.status(404).json({
      message: "User not found!",
    });
  }
    const userRequest = req.body;
  userObj.name = userRequest.name;
  userObj.email = userRequest.email;

  res.json({
    message: "User updated successfully",
    user: userObj,
  });
});

module.exports = router;