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

// 제휴매장정보상세에서 계약활성을 누를 시 작동되는 라우터
router.get("/mangePartner/On", adminRouter.On)

// 제휴매장정보상세에서 계약비활성을 누를 시 작동되는 라우터
router.get("/mangePartner/Off", adminRouter.Off)

// 제휴매장정보상세에서 저장을 누를시 작동되는 라우터
router.post("/mangePartner/updateInfo", adminRouter.updateInfo)

// 제휴매장관리에서 제휴매장분기정보를 보여주는 라우터
router.get("/mangePartner/infoDate", adminRouter.DateDetail)

// 제휴매장분기정보에서 지급률을 바꿀시 보여주는 라우터
router.post("/mangePartner/updateDate", adminRouter.updateDate)

// 제휴매장분기정보에서 메시지를 보내는 라우터
router.post("/mangePartner/sendMessage", adminRouter.sendMessage);

// 제휴매장분기정보에서 메시지 기록을 보는 라우터
router.get("/mangePartner/messageDetail", adminRouter.messageDetail)

// 회원 등급 수정 클릭시 라우터
router.get("/usergrade", adminRouter.userGrade);

// 회원 등급 수정에서 등급에 대해 추가 및 저장시 작동하는 라우터
router.post("/usergrade/update", adminRouter.usergradeupdate);

// 메뉴 통계 조회 클릭시 라우터
router.get("/menuInfo", adminRouter.menuinfo);

// 메뉴 통계 조회에서 검색시 라우터
router.post("/menuInfo/search", adminRouter.menuInfoSearch);

// 메뉴 통계 조회에서 정렬시 라우터
router.post("/menuInfo/order", adminRouter.menuInfoOrder);

// 메뉴 통계 조회에서 각 버튼 3개에 대한 작업 라우터
router.post("/menuInfo/select", adminRouter.selectJob);

module.exports = router;