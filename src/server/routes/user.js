const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/user.js");
const { authorization } = require("../middlewares/authorization.js");

router.post("/login", validator(joischema.login), user.login_user());
router.post("/add-member", validator(joischema.addMember), user.add_member());
router.get("/get-members/:id", authorization(), user.get_members());
router.put("/update-member/:id", authorization(), user.update_member());
router.delete("/delete-member/:id", authorization(), user.delete_member());

module.exports = router;
