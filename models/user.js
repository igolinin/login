const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Joi = require("joi");
const secret = process.env.JWT;
const profileUrl = process.env.PROFILE_SERVICE_HOST;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    default: "not confirmed",
    enum: [
      "not confirmed",
      "confirmed",
      "admin",
      "super admin",
      "client",
      "manager"
    ],
    required: true
  },
  mail_conf: {
    type: String
  }
});
function validateUser(user) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  };
  return Joi.validate(user, schema);
}

userSchema.methods.generateWebToken = async function() {
  const profile = await axios.get(
    `http://${profileUrl}:9090/api/v1/service/user/${this.email}`
  );
  console.log(profile);
  return jwt.sign(
    { email: this.email, role: this.role, country: profile.data.country },
    secret
  );
};
const User = mongoose.model("User", userSchema);

module.exports = User;
exports.validate = validateUser;
