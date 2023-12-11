const express = require('express');
const router = express.Router();

const adminRouter = require("../controller/adminContorller");

// 관리자 첫 화면을 보여주는 라우터
router.get("/", adminRouter.adminView);

// 제휴매장관리 화면을 보여주는 라우터
router.get("/mangePartner", adminRouter.mangePartner);

// 제휴매장관리에서 검색기능을 할시의 라우터
router.post("/mangePartner/search", adminRouter.searchPartner);

// 제휴매장관리에서 정렬하는 라우터
router.post("/mangePartner/order", adminRouter.orderPartner);

// 제휴매장관리에서 제휴매장정보상세 보여주는 라우터
router.get("/mangePartner/infoDetail", adminRouter.infoDetail);

module.exports = router;