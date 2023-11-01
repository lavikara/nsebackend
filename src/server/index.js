const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const env = require("./config/env.js");
const cors = require("cors");
const connectDB = require("../db/connection.js");
const logger = require("./middlewares/logger.js");
const bodyparser = require("body-parser");

const app = express();

const userRouter = require("./routes/user.js");

connectDB();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(logger);
app.use(cors());

app.use("/user", userRouter);

app.listen(env.config.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(` 🔌 NSE IJEDE 🔌 I'm alive on ${env.config.PORT} 🗼 🗼 `);
  }
});
