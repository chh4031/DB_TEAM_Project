const express = require('express');
const router = express.Router();

const partnerlistRouter = require('../controller/partnerlistController');
const partnerdetailRouter = require('../controller/partnerdetailController')

// 제휴매장 목록을 보여주는 화면
router.get("/", partnerlistRouter.partnerlistView);

router.get("/:business_number", partnerdetailRouter.partnerdetailView);

module.exports = router;