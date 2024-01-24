module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      const result = await schema.validate(req.body, {
        abortEarly: false,
      });
      if (result.error) {
        res.status(422).send({
          status: "error",
          message: result.error.details.map((err) => err.message),
        });
        return;
      }
      next();
    } catch (error) {
      console.log(` ❗️ ❗️ ❗️ ${error}  ❗️ ❗️ ❗️ `);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };
};
