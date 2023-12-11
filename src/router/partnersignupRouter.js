const express = require('express');
const router = express.Router();

const partnersignupRouter = require("../controller/partnersignupController");

// 유저 회원가입 화면을 보여주는 라우터
router.get("/", partnersignupRouter.partnersignupView);

router.post("/", partnersignupRouter.partnersignupView2);

module.exports = router;