const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const usermodel = require('../../db/models/userModel.js');

exports.authorization = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        status: "error",
        message: "No token provided",
      });
    }
    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, env.config.JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).send({
        status: "error",
        message: "You're not authenticated",
      });
    }
  };
};

exports.isuser = () => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "user is not found",
        });
      }
      loggedUser = await usermodel.findById(req.user.id);
      if (user.id !== req.user.id && loggedUser.role !== "superAdmin") {
        return res.status(401).send({
          status: "error",
          message: "You're not authorized to perform this action",
        });
      }
      next();
    }
    catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to get user",
      });
    }
  }
}