const express = require("express");
const TestController = require("../../controller/admin/test_controller");

const router = express.Router();

router.get("/email", TestController.sendEmail);
router.get("/whatsapp", TestController.sendWhatsapp);

module.exports = router;
