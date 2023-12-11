const express = require('express');
const router = express.Router();

const partnerRouter = require("../controller/partnerController");

// 제휴매장 첫 화면을 보여주는 라우터
router.get("/", partnerRouter.partnerView);

module.exports = router;