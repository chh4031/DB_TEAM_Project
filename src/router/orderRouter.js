const express = require('express');
const router = express.Router();

const orderRouter = require("../controller/orderController");

router.get('/', orderRouter.orderView);
router.get('/check_duplicate', orderRouter.orderView3);

router.post('/', orderRouter.orderView2)

module.exports = router;