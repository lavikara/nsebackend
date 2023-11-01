const joi = require("joi");

exports.login = joi.object({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().trim().required(),
});

exports.addMember = joi.object({
  first_name: joi.string(),
  last_name: joi.string().required(),
  email: joi.string().email().lowercase().required(),
  address: joi.object({
    street: joi.string().required(),
    lga: joi.string().required(),
    state: joi.string().required(),
  }),
  phone_number: joi
    .string()
    .regex(/(234|0)[7-9][0-1][0-9]{8}/)
    .trim()
    .min(11)
    .max(13)
    .lowercase()
    .required(),
  password: joi.string().min(6).trim().required(),
  date_joined: joi.string().trim(),
  role: joi.string().min(6).trim(),
});
