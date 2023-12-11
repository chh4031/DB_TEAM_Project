const express = require('express');
const router = express.Router();

const menu_regRouter = require("../controller/menu_regController");

// 메뉴 화면을 보여주는 라우터
router.get("/", menu_regRouter.menu_regView);

router.post("/", menu_regRouter.menu_regView2);

module.exports = router;