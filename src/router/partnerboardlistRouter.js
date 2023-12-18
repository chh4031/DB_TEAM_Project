const express = require('express');
const router = express.Router();

const partnerboardRouter = require("../controller/partnerboardlistController");
const boarddetailRouter = require('../controller/boarddetailController')

// 제휴매장 게시판 화면을 보여주는 라우터
router.get("/", partnerboardRouter.partnerboardlistView);

router.get("/:boardno_number", boarddetailRouter.boarddetailView)

router.post("/:boardno_number", boarddetailRouter.boarddetailView2)

module.exports = router;
