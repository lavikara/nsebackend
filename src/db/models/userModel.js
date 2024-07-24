const mongoose = require("mongoose");

/* mongoose user schema */

const userschema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  other_names: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: Object,
    default: ""
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
  dob: {
    type: Date,
    default: null,
  },
  sex: {
    type: String,
    default: null
  },
  marital_status: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', null],
    nullable: true,
    default: null
  },
  country: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  lga: {
    type: String,
    default: ""
  },
  town: {
    type: String,
    default: ""
  },
  religion: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin", "member"],
    default: "member",
  },
});

userschema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const usermodel = mongoose.model("users", userschema);

module.exports = usermodel;
