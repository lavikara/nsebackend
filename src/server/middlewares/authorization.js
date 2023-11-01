const jwt = require("jsonwebtoken");
const env = require("../config/env.js");

exports.authorization = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        status: "error",
        message: "you're not authorized",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, env.config.JWT_SECRET);
    next();
  };
};
