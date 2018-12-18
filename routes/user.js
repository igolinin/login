const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const sgMail = require("../utils/sendgrid");

router.post("/add", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  const salt = await bcrypt.genSalt(10);
  const key = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(req.body.password, salt);
  const newuser = new User({
    email: req.body.email,
    password: hashed,
    status: "not confirmed",
    mail_conf: "key"
  });
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

  res.send(newuser, mail);
  //res.send("ok post");
});
router.get("/confirm/:email/:code", async (req, res) => {
  await User.updateOne(
    { email: req.params.email, mail_conf: req.params.code },
    { $set: { status: "confirmed" } }
  );
  res.send("successfuly confirmed");
});

router.post("/", async (req, res) => {});
router.put("/", (req, res) => {});
router.delete("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User does not exist");
  await User.deleteOne({ email: req.body.email });

  res.send(`User ${req.body.email} succesfully removed`);
});

module.exports = router;
