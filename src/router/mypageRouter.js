const express = require('express');
const router = express.Router();

const mypageRouter = require("../controller/mypageController");

// 마이페이지 첫 화면을 보여주는 라우터
router.get("/", mypageRouter.mypageView);

// 주문내역
router.get("/orderlist", mypageRouter.orderlistView)

// 포인트내역
router.get("/pointlist", mypageRouter.pointlistView)

module.exports = router;