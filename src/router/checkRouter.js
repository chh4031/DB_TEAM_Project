const express = require('express');
const router = express.Router();

const orderRouter = require("../controller/orderController");

router.get('/', orderRouter.orderView3);

module.exports = router;