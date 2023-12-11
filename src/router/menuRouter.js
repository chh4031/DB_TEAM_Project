const express = require('express');
const router = express.Router();

const menuRouter = require("../controller/menuController");

// 메뉴 화면을 보여주는 라우터
router.get("/", menuRouter.menuView);

router.post("/", menuRouter.cartView);

module.exports = router;