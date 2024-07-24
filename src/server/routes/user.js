const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const payment = require("../controllers/payment.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/user.js");
const { authorization, isuser } = require("../middlewares/authorization.js");

router.post("/login", validator(joischema.login), user.login_user());
router.post("/add-member", validator(joischema.addMember), user.add_member());
router.get("/get-members/:id", [authorization(), isuser()], user.get_members());
router.put("/update-member/:id", validator(joischema.updateMember), [authorization(), isuser()], user.update_member());
router.delete("/delete-member/:id", [authorization(), isuser()], user.delete_member());
router.post("/change-password", validator(joischema.changePassword), user.change_password());
router.post("/send-reset-token", user.send_reset_token());
router.post("/create-payment", [authorization()], payment.add_payment(), validator(joischema.payment));
router.get("/verify-payment/:ref", payment.payment_done());
router.get("/payment-history/:id", [authorization()], payment.get_history());

module.exports = router;
