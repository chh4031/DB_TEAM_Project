const express = require('express');
const router = express.Router();

const signupRouter = require("../controller/signupController");

// 유저 회원가입 화면을 보여주는 라우터
router.get("/", signupRouter.signupView);

router.post("/", signupRouter.signupView2);

module.exports = router;