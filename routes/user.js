const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const sgMail = require("../utils/sendgrid");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const profileUrl = process.env.PROFILE_SERVICE_HOST;
const axios = require("axios");

router.post("/add", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  const salt = await bcrypt.genSalt(10);
  //const key = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(req.body.password, salt);
  const newuser = new User({
    email: req.body.email,
    password: hashed,
    role: req.body.role,
    mail_conf: "key"
  });
  await axios.post(
    `http://${profileUrl}:9090/api/v1/service/newuser`,
    req.body
  );
  const result = await newuser.save();
  const msg = {
    to: req.body.email,
    from: "igolinin@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a  href="http://localhost:3000/api/v1/user/confirm/${
      req.body.email
    }/${key}">confirm</a>`
  };
  const mail = await sgMail.send(msg);
  res.send(newuser);
  //res.send("ok post");
});
router.delete("/all", async (req, res) => {
  await axios.delete(`http://${profileUrl}:9090/api/v1/service/all`);
  await User.deleteMany({});
  res.send("OK");
});
router.get("/all", async (req, res) => {
  const result = await User.find({});
  res.send({});
});
router.get("/confirm/:email/:code", async (req, res) => {
  await User.updateOne(
    { email: req.params.email, mail_conf: req.params.code },
    { $set: { role: "user" } }
  );
  res.send("successfuly confirmed");
});

router.put("/password", auth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");
  else {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.newPassword, salt);
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: hashed } }
    );
  }

  res.send("updated");
});
router.put("/role", [auth, admin], async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("user not found");
  await User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { role: req.body.newRole } }
  );
  res.send("ok here");
});
router.delete("/", auth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User does not exist");

  await axios.delete(`http://${profileUrl}:9090/api/v1/service/`, {
    data: {
      email: req.body.email
    }
  });

  await User.deleteOne({ email: req.body.email });

  res.status(204).send(`User ${req.body.email} succesfully removed`);
});

module.exports = router;
