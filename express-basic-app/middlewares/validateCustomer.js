const validateCustomer = (req, res, next) => {
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

  next();
};

module.exports = validateCustomer;
