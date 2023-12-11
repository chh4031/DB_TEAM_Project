const express = require('express');
const router = express.Router();

const mainRouter = require("../controller/mainController");

// 메인 첫 화면을 보여주는 라우터
router.get("/", mainRouter.mainView);

// 로그인 화면을 보여주는 라우터, 이거 login하니깐 맛가서 logi 함 걍 하면됨
router.get("/logi", mainRouter.login);

// 로그인 체크 라우터
router.post("/check", mainRouter.checkLogin)

// 로그아웃 라우터
router.get("/logout", mainRouter.logout)

module.exports = router;