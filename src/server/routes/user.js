const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/user.js");
const { authorization } = require("../middlewares/authorization.js");

router.post("/login", validator(joischema.login), user.login_user());
router.post("/add-member", validator(joischema.addMember), user.add_member());

module.exports = router;
