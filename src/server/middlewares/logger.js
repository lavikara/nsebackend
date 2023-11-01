// Logger Middleware: Logs the time, method, and URL of every request
const logger = (req, res, next) => {
  const { url, method } = req;
  console.log(
    ` 🕥 [${new Date().toTimeString()}] 🕙 : 💃 🕺 Got a ${method} request from ${url} 👍 👍 `
  );
  next();
};

module.exports = logger;
