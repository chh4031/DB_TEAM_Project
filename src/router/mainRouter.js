const express = require('express');
const router = express.Router();

const mainRouter = require("../controller/mainController");

// 메인 첫 화면을 보여주는 라우터
router.get("/", mainRouter.mainView);

module.exports = router;