const express = require('express');
const router = express.Router();

const mypartnerRouter = require("../controller/mypartnerController");

// 마이페이지 첫 화면을 보여주는 라우터
router.get("/", mypartnerRouter.mypartnerView);

module.exports = router;