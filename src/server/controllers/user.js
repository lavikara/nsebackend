const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const usermodel = require("../../db/models/userModel.js");
const pro_details = require("../../db/models/pro_details.js");
const resetPasswordModel = require("../../db/models/reset_password.js");
const sendEmail = require("../utils/mail.js");

exports.add_member = () => {
  return async (req, res, next) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await usermodel.create(req.body);
      const pro = await pro_details.create({
        user: user._id,
      });

      const userobj = user.toJSON();
      delete userobj.password;

      res.status(201).send({
        status: "success",
        data: { user: userobj },
      });
    } catch (err) {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).send({
          status: "error",
          message: `${Object.keys(err.keyValue)[0]} already exists`,
        });
      }

      if (err.name === "ValidationError") {
        return res.status(400).send({
          status: "error",
          message: err.message,
        });
      }

      res.status(500).send({
        status: "error",
        message: "an error occured while adding",
      });
    }
  };
};

exports.login_user = () => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findOne(
        { email: req.body.email },
        "+password"
      );

      if (!user) {
        return res.status(403).send({
          status: "error",
          message: "invalid account",
        });
      }

      const ispasswordvalid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!ispasswordvalid) {
        return res.status(403).send({
          status: "error",
          message: "invalid account",
        });
      }

      const userobj = user.toJSON();

      const token = jwt.sign({ id: userobj.id }, env.config.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).send({
        status: "success",
        data: { user: userobj, token },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to login",
      });
    }
  };
};

exports.get_members = (id) => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findById(req.params.id);
      const userobj = user.toJSON();
      res.status(200).send({
        status: "success",
        data: { user: userobj },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to get user",
      });
    }
  }
}

exports.update_member = (id) => {
  return async (req, res, next) => {
    try {
      let data = req.body;
      let loggedUser = await usermodel.findById(req.user.id);
      if (loggedUser.role !== "superAdmin") {
        delete data.role;
        delete data.email;
        delete data.password;
        delete data.last_name;
        delete data.first_name;
        delete data.other_names;
        delete data.dob;
      }
      console.log(loggedUser);
      const user = await usermodel.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );
      const userobj = user.toJSON();
      res.status(200).send({
        status: "success",
        data: { user: userobj },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to update user",
      });
    }
  }
}

exports.delete_member = (id) => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findByIdAndDelete(req.params.id);
      res.status(204).send({
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to delete user",
      });
    }
  }
}

exports.get_pro_details = (id) => {
  return async (req, res, next) => {
    try {
      const pro = await pro_details.findOne({ user: req.params.id });
      res.status(200).send({
        status: "success",
        data: { pro },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to get pro details",
      });
    }
  }
}

exports.update_pro_details = (id) => {
  return async (req, res, next) => {
    try {
      let loggedUser = await usermodel.findById(req.user.id);
      if (loggedUser.role !== "superAdmin") {
        delete req.body.user;
        delete req.body.membership_status;
        delete req.body.finicial_status;
        delete req.body.membership_grade;
        delete req.body.membership_branch;
        delete req.body.membership_division;
        // delete req.body.specialization;
        delete req.body.coren_number;
        delete req.body.coren_engineering_category;
        // delete req.body.coren_registration_date;
        delete req.body.registration_number;
      }
      const pro = await pro_details.findOneAndUpdate(
        { user: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).send({
        status: "success",
        data: { pro },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to update pro details",
      });
    }
  }
}

exports.change_password = () => {
  return async (req, res, next) => {
    try {
      const resetpassword = await resetPasswordModel.findOne({
        token: req.body.token,
      });

      if (!resetpassword) {
        return res.status(400).send({
          status: "error",
          message: "invalid token",
        });
      }

      if (resetpassword.expires < new Date()) {
        return res.status(400).send({
          status: "error",
          message: "expired token",
        });
      }

      newpassword = await bcrypt.hash(req.body.password, 10);

      const user = await usermodel.findOneAndUpdate(
        { email: resetpassword.email },
        { password: newpassword },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).send({
        status: "success",
        message: "password changed successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to change password",
      });
    }
  }
}

exports.send_reset_token = () => {
  return async (req, res, next) => {
    try {

      if (!req.body.email) {
        return res.status(400).send({
          status: "error",
          message: "email is required",
        });
      }

      if (!req.body.siteUrl) {
        return res.status(400).send({
          status: "error",
          message: "siteUrl is required",
        });
      }

      const user = await usermodel.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(400).send({
          status: "error",
          message: "invalid email",
        });
      }

      const token = jwt.sign({ id: user.id }, env.config.JWT_SECRET, {
        expiresIn: "1h",
      });

      try {
        await resetPasswordModel.deleteMany({ email: user.email });
      } catch (err) {
        console.log(err);
      }

      await resetPasswordModel.create({
        email: user.email,
        token,
        expires: new Date(Date.now() + 3600000),
      });

      console.log(req.body)

      const reseturl = `${req.body.siteUrl}/${token}`;
      console.log(reseturl);
      // send email

      sendEmail(
        user.email,
        "Password reset",
        `click <a href=${reseturl}>here</a> to reset your password`,
        `click <a href=${reseturl}>here</a> to reset your password`
      );

      res.status(200).send({
        status: "success",
        message: "reset link sent to email",
      });
    }
    catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to reset password",
      });
    }
  }
}
