const joi = require("joi");

exports.login = joi.object({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().trim().required(),
});

const UserModel = joi.object({
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

const update = joi.object({
  first_name: joi.string(),
  last_name: joi.string(),
  email: joi.forbidden(),
  address: joi.object({
    street: joi.string(),
    lga: joi.string(),
    state: joi.string(),
  }),
  phone_number: joi
    .string()
    .regex(/(234|0)[7-9][0-1][0-9]{8}/)
    .trim()
    .min(11)
    .max(13)
    .lowercase(),
  password: joi.forbidden(),
  date_joined: joi.forbidden(),
  role: joi.forbidden(),
});

const changePassword = joi.object({
  old_password: joi.string().min(6).trim().required(),
  new_password: joi.string().min(6).trim().required(),
});

exports.addMember = UserModel;
exports.updateMember = update;
exports.changePassword = changePassword;