const express = require("express");

const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  const token = await user.generateWebToken();
  res.send(token);
});

module.exports = router;
