const express = require('express');
const router = express.Router();

const partnerboardRouter = require("../controller/partnerboardController");

// 제휴매장 게시판 화면을 보여주는 라우터
router.get("/", partnerboardRouter.partnerboardView);

module.exports = router;