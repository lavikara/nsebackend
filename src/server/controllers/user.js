const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const usermodel = require("../../db/models/userModel.js");

exports.add_member = () => {
  console.log("im here");
  return async (req, res, next) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await usermodel.create(req.body);

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
      userobj["_id"] = userobj["id"];
      delete userobj.password;
      delete userobj._id;

      const token = jwt.sign({ id: userobj.id }, env.config.JWT_SECRET, {
        expiresIn: "8760h",
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
      const user = await usermodel.findByIdAndUpdate(
        req.params.id,
        req.body,
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

exports.change_password = (id) => {
  return async (req, res, next) => {
    try {
      if (req.body.new_password == req.body.old_password) {
        return res.status(400).send({
          status: "error",
          message: "new password cannot be the same as old password",
        });
      }

      var userobj = await usermodel.findById(req.params.id);
      userobj = userobj.toJSON();

      const user = await usermodel.findOne(
        { email: userobj.email },
        "+password"
      );

      const ispasswordvalid = await bcrypt.compare(
        req.body.old_password,
        user.password
      );

      if (!ispasswordvalid) {
        return res.status(403).send({
          status: "error",
          message: "invalid password",
        });
      }

      const newPasswordHash = await bcrypt.hash(req.body.new_password, 10);

      user.password = newPasswordHash;
      await user.save();

      res.status(200).send({
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to change password",
      });
    }
  };
};