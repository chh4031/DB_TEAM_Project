const express = require('express');
const router = express.Router();

const adminRouter = require("../controller/adminContorller");

// 관리자 첫 화면을 보여주는 라우터
router.get("/", adminRouter.adminView);

module.exports = router;