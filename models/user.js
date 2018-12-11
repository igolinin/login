const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

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
    enum: ["not confirmed", "confirmed", "admin", "super admin"],
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

userSchema.methods.generateWebToken = function() {
  return jwt.sign({ email: this.email, role: this.role }, "secret");
};
const User = mongoose.model("User", userSchema);

module.exports = User;
