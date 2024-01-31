const mongoose = require("mongoose");

/* mongoose user schema */

const userschema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: Object,
    // required: true,
  },
  phone_number: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  date_joined: {
    type: Date,
    // required: true,
  },
  payment_details: {
    type: Object,
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin", "member"],
  },
});

userschema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const usermodel = mongoose.model("users", userschema);

module.exports = usermodel;
