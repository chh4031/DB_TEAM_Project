const express = require('express');
const router = express.Router();

const cartRouter = require("../controller/cartController");

// 메인 첫 화면을 보여주는 라우터
router.get("/", cartRouter.cartView);

module.exports = router;