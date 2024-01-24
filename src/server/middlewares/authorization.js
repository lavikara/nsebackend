const jwt = require("jsonwebtoken");
const env = require("../config/env.js");

exports.authorization = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        status: "error",
        message: "you're not authorized",
      });
    }
    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, env.config.JWT_SECRET);
      req.user = payload;
      next();
    }
    catch (err) {
      res.status(401).send({
        status: "error",
        message: "you're not authorized",
      });
    }
  };
};
